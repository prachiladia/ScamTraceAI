import re
import uuid
from typing import List, Optional
from backend.app.models.schemas import EvidenceItem
from backend.app.engine.lexical_url import extract_lexical_features, HIGH_RISK_TLDS

DOCUMENTED_BRANDS = {
    "sbi": "State Bank of India (SBI)",
    "state bank": "State Bank of India (SBI)",
    "hdfc": "HDFC Bank",
    "icici": "ICICI Bank",
    "axis": "Axis Bank",
    "pnb": "Punjab National Bank (PNB)",
    "bank of baroda": "Bank of Baroda",
    "india post": "India Post / Postal Service",
    "indiapost": "India Post / Postal Service",
    "speed post": "India Post Speed Post",
    "amazon": "Amazon",
    "flipkart": "Flipkart",
    "netflix": "Netflix",
    "whatsapp": "WhatsApp Messenger",
    "telegram": "Telegram",
    "income tax": "Income Tax Department",
    "aadhaar": "UIDAI / Aadhaar",
    "electricity": "State Electricity Board"
}

URGENCY_PATTERNS = [
    (re.compile(r"\b(?:urgent|immediately|right now|hurry|instantly|asap)\b", re.I), "Imposes acute temporal pressure to bypass critical verification."),
    (re.compile(r"\bwithin\s+\d+\s+(?:hours?|hrs?|minutes?|mins?)\b", re.I), "Imposes an artificial critical countdown deadline."),
    (re.compile(r"\b(?:account|card|profile|sim)\s+(?:has been|is|was)\s+(?:suspended|blocked|frozen|locked|deactivated|cancelled)\b", re.I), "Falsely claims service suspension or account lockout to induce panic."),
    (re.compile(r"\b(?:police report|legal action|arrest warrant|court notice)\b", re.I), "Leverages legal or police threats to coerce rapid compliance.")
]

KYC_PATTERNS = [
    (re.compile(r"\b(?:update|complete|verify|pending)\s+kyc\b", re.I), "Coerces identity or KYC documentation update via unauthorized channel."),
    (re.compile(r"\blink\s+(?:aadhaar|pan|pan card)\b", re.I), "Requests sensitive government identity card linkage."),
    (re.compile(r"\bkyc\s+(?:overdue|expired|mandatory)\b", re.I), "Alleges mandatory overdue compliance to justify external link action.")
]

OTP_CREDENTIAL_PATTERNS = [
    (re.compile(r"\b(?:share|enter|send|provide|submit)\s+(?:your\s+)?(?:otp|one time password|pin|password|cvv)\b", re.I), "Explicitly requests secret multi-factor authentication token or credentials."),
    (re.compile(r"\b(?:verify|authenticate)\s+(?:your\s+)?(?:otp|credentials|password)\b", re.I), "Directs recipient to authenticate security credentials externally.")
]

PROTECTIVE_OTP_PATTERNS = [
    re.compile(r"\b(?:never|do not|don't)\s+share\s+(?:your\s+)?(?:otp|password|pin)\b", re.I),
    re.compile(r"\bbank\s+(?:will\s+never|never)\s+ask\b", re.I),
    re.compile(r"\bfor\s+(?:your\s+)?security,\s+do\s+not\s+share\b", re.I)
]

PAYMENT_DEMAND_PATTERNS = [
    (re.compile(r"\b(?:pay|transfer|deposit|send)\s+(?:rs\.?|inr|₹|\$)?\s*\d+\b", re.I), "Demands immediate financial transfer or fee clearance."),
    (re.compile(r"\b(?:redelivery|customs|processing|unfreeze|penalty)\s+fee\b", re.I), "Fabricates an administrative or parcel clearance fee requirement.")
]

PRIZE_LURE_PATTERNS = [
    (re.compile(r"\b(?:congratulations|congrats|you have won|winner of|selected for|lottery)\b", re.I), "Employs an unexpected prize or lottery lure to incentivize link interaction."),
    (re.compile(r"\bclaim\s+(?:reward|cashback|prize|gift)\b", re.I), "Directs victim to claim an unearned cash or gift reward.")
]

def extract_evidence(text: str, url: Optional[str] = None) -> List[EvidenceItem]:
    evidence_list: List[EvidenceItem] = []
    lower_text = text.lower()

    # Rule Context Check: Is this a legitimate protective security warning?
    is_protective_notice = any(pat.search(text) for pat in PROTECTIVE_OTP_PATTERNS)

    # 1. Urgency & Threats
    for pattern, explanation in URGENCY_PATTERNS:
        for match in pattern.finditer(text):
            evidence_list.append(EvidenceItem(
                id=str(uuid.uuid4())[:8],
                type="urgency_threat",
                matched_text=match.group(0),
                explanation=explanation,
                source_component="heuristic_nlp",
                severity="high",
                confidence=0.92,
                start_idx=match.start(),
                end_idx=match.end()
            ))

    # 2. KYC & Identity Demands
    for pattern, explanation in KYC_PATTERNS:
        for match in pattern.finditer(text):
            evidence_list.append(EvidenceItem(
                id=str(uuid.uuid4())[:8],
                type="identity_verification",
                matched_text=match.group(0),
                explanation=explanation,
                source_component="heuristic_nlp",
                severity="high",
                confidence=0.90,
                start_idx=match.start(),
                end_idx=match.end()
            ))

    # 3. OTP & Credential Theft vs Protective Warning
    if is_protective_notice:
        for pat in PROTECTIVE_OTP_PATTERNS:
            for match in pat.finditer(text):
                evidence_list.append(EvidenceItem(
                    id=str(uuid.uuid4())[:8],
                    type="protective_disclaimer",
                    matched_text=match.group(0),
                    explanation="Standard authentic institutional warning explicitly advising never to share credentials.",
                    source_component="context_auditor",
                    severity="low",
                    confidence=0.95,
                    start_idx=match.start(),
                    end_idx=match.end()
                ))
    else:
        for pattern, explanation in OTP_CREDENTIAL_PATTERNS:
            for match in pattern.finditer(text):
                evidence_list.append(EvidenceItem(
                    id=str(uuid.uuid4())[:8],
                    type="otp_credential_theft",
                    matched_text=match.group(0),
                    explanation=explanation,
                    source_component="heuristic_nlp",
                    severity="high",
                    confidence=0.96,
                    start_idx=match.start(),
                    end_idx=match.end()
                ))

    # 4. Payment Demands & Unfreeze Fees
    for pattern, explanation in PAYMENT_DEMAND_PATTERNS:
        for match in pattern.finditer(text):
            evidence_list.append(EvidenceItem(
                id=str(uuid.uuid4())[:8],
                type="payment_demand",
                matched_text=match.group(0),
                explanation=explanation,
                source_component="heuristic_nlp",
                severity="high" if "unfreeze" in match.group(0).lower() else "medium",
                confidence=0.88,
                start_idx=match.start(),
                end_idx=match.end()
            ))

    # 5. Prize / Reward Lures
    for pattern, explanation in PRIZE_LURE_PATTERNS:
        for match in pattern.finditer(text):
            evidence_list.append(EvidenceItem(
                id=str(uuid.uuid4())[:8],
                type="prize_lure",
                matched_text=match.group(0),
                explanation=explanation,
                source_component="heuristic_nlp",
                severity="medium",
                confidence=0.85,
                start_idx=match.start(),
                end_idx=match.end()
            ))

    # 6. Brand Impersonation Cues
    for brand_key, brand_name in DOCUMENTED_BRANDS.items():
        pattern = re.compile(rf"\b{re.escape(brand_key)}\b", re.I)
        for match in pattern.finditer(text):
            # Only flag as suspicious brand cue if paired with other suspicious indicators or external link
            has_other_flags = len(evidence_list) > 0 or url is not None
            if has_other_flags and not is_protective_notice:
                evidence_list.append(EvidenceItem(
                    id=str(uuid.uuid4())[:8],
                    type="brand_impersonation",
                    matched_text=match.group(0),
                    explanation=f"Contextual reference to {brand_name} appears alongside coercive indicators.",
                    source_component="entity_auditor",
                    severity="high",
                    confidence=0.89,
                    start_idx=match.start(),
                    end_idx=match.end()
                ))
            break # One match per brand key

    # 7. Safe Lexical URL Evidence (Zero network)
    if url:
        lex = extract_lexical_features(url)
        if lex["is_high_risk_tld"]:
            evidence_list.append(EvidenceItem(
                id=str(uuid.uuid4())[:8],
                type="suspicious_url",
                matched_text=f"TLD: .{lex['tld']}",
                explanation=f"Top-level domain (.{lex['tld']}) exhibits elevated correlation with disposable phishing infrastructure.",
                source_component="lexical_url",
                severity="high",
                confidence=0.91,
                start_idx=None,
                end_idx=None
            ))

        if lex["has_ip"]:
            evidence_list.append(EvidenceItem(
                id=str(uuid.uuid4())[:8],
                type="suspicious_url",
                matched_text="IP-in-URL",
                explanation="Destination address uses a raw IP instead of a registered domain name.",
                source_component="lexical_url",
                severity="high",
                confidence=0.95,
                start_idx=None,
                end_idx=None
            ))

        if lex["suspicious_words"] > 0:
            evidence_list.append(EvidenceItem(
                id=str(uuid.uuid4())[:8],
                type="suspicious_url",
                matched_text=f"{lex['suspicious_words']} sensitive keyword(s) in URL",
                explanation="URL embeds sensitive authentication keywords (login/verify/portal/banking).",
                source_component="lexical_url",
                severity="medium",
                confidence=0.86,
                start_idx=None,
                end_idx=None
            ))

    return evidence_list
