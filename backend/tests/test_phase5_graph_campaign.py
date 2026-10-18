import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_phase5_shared_indicator_and_campaigns():
    # 1. First Submission with shared malicious URL
    res1 = client.post("/api/investigations", json={
        "text": "SBI Alert: Your NetBanking profile has been locked. Verify immediately at http://sbi-kyc-verify-portal.top/login to prevent permanent suspension.",
        "url": "http://sbi-kyc-verify-portal.top/login",
        "generate_ai_report": False
    })
    assert res1.status_code == 200
    inv1 = res1.json()
    id1 = inv1["id"]

    # 2. Second Submission with the SAME shared malicious URL
    res2 = client.post("/api/investigations", json={
        "text": "URGENT: State Bank account 3912 has been suspended. Update KYC at http://sbi-kyc-verify-portal.top/login within 2 hours.",
        "url": "http://sbi-kyc-verify-portal.top/login",
        "generate_ai_report": False
    })
    assert res2.status_code == 200
    inv2 = res2.json()
    id2 = inv2["id"]

    # 3. Verify Global Graph shows SHARES_INDICATOR_WITH edge
    graph_res = client.get("/api/investigations/graph")
    assert graph_res.status_code == 200
    graph_data = graph_res.json()

    shared_edges = [
        e for e in graph_data["edges"]
        if e["label"] == "SHARES_INDICATOR_WITH"
    ]
    assert len(shared_edges) >= 1, "Expected at least one SHARES_INDICATOR_WITH edge between related cases"

    # Verify that the two cases also share the landing URL node
    url_nodes = [n for n in graph_data["nodes"] if n["type"] == "url"]
    assert len(url_nodes) >= 1

    # 4. Verify Single-Investigation State
    single_res = client.get(f"/api/investigations/{id1}/graph")
    assert single_res.status_code == 200
    single_graph = single_res.json()
    assert single_graph["investigation_id"] == id1

    # In single investigation graph, the only investigation node is id1
    inv_nodes = [n for n in single_graph["nodes"] if n["type"] == "investigation"]
    assert len(inv_nodes) == 1
    assert inv_nodes[0]["id"] == f"inv-{id1[:8]}"

    # 5. Verify Campaign Intelligence Clusters
    camp_res = client.get("/api/campaigns")
    assert camp_res.status_code == 200
    campaigns = camp_res.json()
    assert len(campaigns) >= 1

    # Find cluster for the shared URL or template
    url_cluster = next((c for c in campaigns if c["indicator_type"] == "url"), None)
    assert url_cluster is not None
    assert url_cluster["investigation_count"] >= 2
    assert id1 in url_cluster["investigation_ids"]
    assert id2 in url_cluster["investigation_ids"]
