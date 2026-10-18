import math
from typing import List, Tuple, Optional
from backend.app.models.schemas import EvidenceItem, ModelPrediction

def compute_risk_assessment(
    text: str,
    evidence: List[EvidenceItem],
    message_pred: Optional[ModelPrediction],
    url_pred: Optional[ModelPrediction],
    has_url: bool
) -> Tuple[str, float, str]:
    """
    Computes an interpretable forensic Risk Index (0.0 to 100.0) and assigns an
    objective threat tier: 'Lower concern', 'Suspicious', 'High concern', or 'Insufficient evidence'.
    Rule A.5: Separates ML predictions from deterministic rules and never labels
    the index as a proof of fraud.
    """
    clean_text = text.strip()
    
    # 1. Check for insufficient evidence
    if len(clean_text) < 15 and not has_url and len(evidence) == 0:
        return (
            "Insufficient evidence",
            0.0,
            "The submitted content is too brief or ambiguous to reliably detect deceptive indicators or psychological coercion."
        )

    # 2. Factor Contributions
    factor_weights = {
        "urgency_threat": 28.0,
        "identity_verification": 25.0,
        "otp_credential_theft": 35.0,
        "payment_demand": 22.0,
        "prize_lure": 20.0,
        "brand_impersonation": 18.0,
        "suspicious_url": 26.0,
        "protective_disclaimer": -45.0,
    }

    raw_evidence_score = 0.0
    detected_types = set()
    rationale_reasons = []

    for ev in evidence:
        if ev.type not in detected_types:
            detected_types.add(ev.type)
            weight = factor_weights.get(ev.type, 10.0)
            raw_evidence_score += weight

            if ev.type == "urgency_threat":
                rationale_reasons.append("artificial urgency or account freeze threat")
            elif ev.type == "otp_credential_theft":
                rationale_reasons.append("unauthorized credential/OTP solicitation")
            elif ev.type == "identity_verification":
                rationale_reasons.append("unverified KYC or identity document demand")
            elif ev.type == "brand_impersonation":
                rationale_reasons.append("institutional brand impersonation")
            elif ev.type == "suspicious_url":
                rationale_reasons.append("suspicious lexical URL patterns (e.g., high-risk TLD or embedded IP)")
            elif ev.type == "payment_demand":
                rationale_reasons.append("unverified payment or parcel fee demand")
            elif ev.type == "prize_lure":
                rationale_reasons.append("unsolicited prize or lottery claim lure")
            elif ev.type == "protective_disclaimer":
                rationale_reasons.append("presence of standard security advisory warning recipients not to share OTPs")

    # ML Model Contributions
    ml_contribution = 0.0
    if message_pred and message_pred.predicted_class == "spam_related":
        # Calibrated probability contributes up to 25 points
        ml_contribution += 25.0 * message_pred.score
        rationale_reasons.append(f"message text matches known spam lure patterns ({message_pred.score*100:.1f}% calibrated match)")

    if url_pred and url_pred.predicted_class == "phishing_url":
        # Lexical URL decision score contributes up to 25 points
        ml_contribution += 25.0 * url_pred.score
        rationale_reasons.append(f"destination URL matches lexical phishing structures ({url_pred.score*100:.1f}% decision score)")

    total_raw = raw_evidence_score + ml_contribution

    # If protective disclaimers dominate and no severe threats exist, ensure score remains very low
    if "protective_disclaimer" in detected_types and "otp_credential_theft" not in detected_types and "suspicious_url" not in detected_types:
        total_raw = min(total_raw, 15.0)

    # 3. Saturation Curve (diminishing returns to prevent double counting correlated factors)
    # R = 100 * (1 - e^(-total_raw / 60))
    if total_raw <= 0:
        risk_score = 0.0
    else:
        risk_score = 100.0 * (1.0 - math.exp(-total_raw / 55.0))
        risk_score = min(99.0, max(0.0, risk_score))

    # 4. Categorization
    if risk_score >= 70.0:
        risk_level = "High concern"
    elif risk_score >= 32.0:
        risk_level = "Suspicious"
    else:
        risk_level = "Lower concern"

    # 5. Formulate Plain-Language Rationale
    if rationale_reasons:
        reasons_text = ", ".join(rationale_reasons[:4])
        rationale = f"Assessed as {risk_level} (Index: {risk_score:.1f}/100) based on: {reasons_text}."
    else:
        rationale = f"Assessed as {risk_level} (Index: {risk_score:.1f}/100). No significant coercive psychological patterns or malicious lexical indicators were observed."

    return risk_level, round(risk_score, 1), rationale
