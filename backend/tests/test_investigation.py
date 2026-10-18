import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.app.engine.validator import sanitize_and_validate_input
from backend.app.engine.lexical_url import extract_lexical_features, calculate_shannon_entropy
from backend.app.engine.evidence_extractor import extract_evidence
from backend.app.engine.entity_extractor import extract_entities, mask_phone, mask_email, mask_url
from backend.app.engine.risk_scorer import compute_risk_assessment

client = TestClient(app)

def test_input_sanitization():
    # XSS vector
    raw_xss = "<script>alert('pwned')</script>URGENT: Verify your account"
    clean_text, _, err = sanitize_and_validate_input(raw_xss)
    assert err is None
    assert "<script>" not in clean_text
    assert "&lt;script&gt;" in clean_text

    # Too short input
    _, _, short_err = sanitize_and_validate_input("hi")
    assert short_err is not None

    # Disallowed javascript URI
    _, _, uri_err = sanitize_and_validate_input("Legitimate text", "javascript:alert(1)")
    assert uri_err is not None

def test_lexical_url_offline():
    url = "http://sbi-kyc-verify-portal.top/login"
    feats = extract_lexical_features(url)
    assert feats["url_length"] == len(url)
    assert feats["num_dots"] == 1
    assert feats["is_high_risk_tld"] == 1
    assert feats["tld"] == "top"
    assert feats["suspicious_words"] >= 2 # 'kyc' / 'login' / 'verify'
    assert feats["entropy"] > 3.0

def test_evidence_extraction_and_protective_distinction():
    # Malicious coercion
    scam_text = "URGENT: Your SBI account has been suspended. Update KYC immediately or share your OTP."
    ev_scam = extract_evidence(scam_text, "http://sbi-fake.top")
    ev_types = [e.type for e in ev_scam]
    assert "urgency_threat" in ev_types
    assert "identity_verification" in ev_types
    assert "otp_credential_theft" in ev_types
    assert "brand_impersonation" in ev_types

    # Verified span bounds
    for ev in ev_scam:
        if ev.start_idx is not None and ev.end_idx is not None:
            assert scam_text[ev.start_idx:ev.end_idx] == ev.matched_text

    # Legitimate protective warning
    legit_text = "State Bank of India: Your OTP for transaction of INR 1,500 is 987123. Never share your OTP with anyone."
    ev_legit = extract_evidence(legit_text)
    legit_types = [e.type for e in ev_legit]
    assert "protective_disclaimer" in legit_types
    assert "otp_credential_theft" not in legit_types

def test_entity_masking():
    assert mask_phone("+919876543210") == "+91***10"
    assert mask_email("victim@example.com") == "v***m@example.com"
    masked_url = mask_url("http://sbi-kyc-portal.top/login")
    assert "***" in masked_url

def test_risk_scoring_categories():
    # Insufficient evidence
    level, score, _ = compute_risk_assessment("Hello there", [], None, None, False)
    assert level == "Insufficient evidence"
    assert score == 0.0

    # High concern
    scam_text = "URGENT: Account locked. Pay Rs 500 now at http://fake.top"
    ev = extract_evidence(scam_text, "http://fake.top")
    level_high, score_high, rationale_high = compute_risk_assessment(scam_text, ev, None, None, True)
    assert level_high == "High concern"
    assert score_high >= 70.0
    assert "artificial urgency" in rationale_high

def test_api_investigation_roundtrip():
    payload = {
        "text": "URGENT: Your State Bank account 4921 has been suspended due to pending KYC verification. Update immediately at http://sbi-kyc-verify-portal.top/login",
        "url": "http://sbi-kyc-verify-portal.top/login",
        "generate_ai_report": False
    }

    # 1. POST create investigation
    post_res = client.post("/api/investigations", json=payload)
    assert post_res.status_code == 200
    data = post_res.json()
    assert "id" in data
    assert data["risk_level"] == "High concern"
    assert len(data["evidence"]) >= 3
    assert len(data["entities"]) >= 1
    assert data["message_prediction"] is not None
    assert data["url_prediction"] is not None

    inv_id = data["id"]

    # 2. GET by ID from SQLite database
    get_res = client.get(f"/api/investigations/{inv_id}")
    assert get_res.status_code == 200
    fetched_data = get_res.json()
    assert fetched_data["id"] == inv_id
    assert fetched_data["input_text"] == payload["text"]
    assert fetched_data["risk_level"] == "High concern"

    # 3. GET graph
    graph_res = client.get(f"/api/investigations/graph?investigation_id={inv_id}")
    assert graph_res.status_code == 200
    graph_data = graph_res.json()
    assert len(graph_data["nodes"]) >= 2
    assert len(graph_data["edges"]) >= 1

    # 4. GET dashboard stats
    stats_res = client.get("/api/dashboard/stats")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_investigations"] >= 1
    assert stats["high_concern_count"] >= 1

def test_model_metrics_endpoint():
    res = client.get("/api/models/metrics")
    assert res.status_code == 200
    metrics = res.json()
    assert "message_model" in metrics
    assert "url_model" in metrics
    assert metrics["message_model"]["test_metrics"]["accuracy"] > 0.90
    assert metrics["url_model"]["test_metrics"]["accuracy"] > 0.90
