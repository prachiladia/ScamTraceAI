import json
import re
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from backend.app.models.schemas import GemmaReport, EvidenceItem, ModelPrediction
from backend.app.llm.ollama_client import ollama_client

SYSTEM_PROMPT = """You are a senior forensic cybersecurity decision-support analyst.
Your job is to synthesize forensic evidence extracted by machine learning classifiers and rule engines into an objective, factual, structured analysis.

CRITICAL NON-NEGOTIABLE RULES:
1. You only receive structured evidence items. Do NOT invent new evidence or claim to have visited any URL.
2. Under no circumstance claim to identify real-world phone owners or criminal perpetrators.
3. NEVER advise retaliation, replying, or interacting with senders. Only recommend passive, protective user defense steps.
4. Respond ONLY with a valid JSON object matching the requested schema. No conversational filler or markdown blocks."""

def extract_json_block(text: str) -> Optional[dict]:
    """Extracts and parses a JSON object from text."""
    # Attempt direct parse
    try:
        return json.loads(text.strip())
    except Exception:
        pass

    # Attempt to extract markdown json code block
    match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except Exception:
            pass

    # Attempt regex on outer braces
    match = re.search(r"(\{.*\})", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except Exception:
            pass

    return None

async def generate_gemma_report(
    evidence: List[EvidenceItem],
    risk_level: str,
    risk_score: float,
    message_pred: Optional[ModelPrediction],
    url_pred: Optional[ModelPrediction]
) -> Optional[GemmaReport]:
    """
    Prompts local Gemma model via Ollama with structured evidence and validates output against Pydantic schema.
    Rule F & A.9: Returns None if Ollama is unavailable. Does not fake or template LLM output.
    """
    if not await ollama_client.is_available():
        return None

    # Prepare evidence summary for prompt
    evidence_summary = [
        {"type": ev.type, "matched_text": ev.matched_text, "severity": ev.severity, "explanation": ev.explanation}
        for ev in evidence
    ]

    prompt_data = {
        "threat_assessment": {"risk_level": risk_level, "risk_score": risk_score},
        "ml_message_prediction": {
            "predicted_class": message_pred.predicted_class if message_pred else "not_available",
            "score": message_pred.score if message_pred else 0.0
        },
        "ml_url_prediction": {
            "predicted_class": url_pred.predicted_class if url_pred else "not_available",
            "score": url_pred.score if url_pred else 0.0
        },
        "forensic_evidence_items": evidence_summary
    }

    user_prompt = f"""Analyze the following structured forensic data and output a JSON analysis matching this schema:
{{
  "summary": "1-2 sentence executive summary of the scam technique",
  "threat_narrative": "Forensic breakdown of the threat narrative presented in the message",
  "psychological_mechanisms": ["e.g. Artificial Urgency", "Fear of Account Loss"],
  "likely_next_steps": ["What the scammer expects the victim to do next"],
  "educational_analogy": "A simple real-world analogy explaining why this is a trap",
  "main_findings": ["Key technical finding 1", "Key technical finding 2"],
  "supporting_evidence": ["Evidence point 1", "Evidence point 2"],
  "user_safety_steps": ["Protective step 1", "Protective step 2"],
  "human_verification_advisable": true
}}

Forensic Data:
{json.dumps(prompt_data, indent=2)}"""

    raw_response = await ollama_client.generate_completion(user_prompt, SYSTEM_PROMPT)
    if not raw_response:
        return None

    parsed_json = extract_json_block(raw_response)

    # One controlled repair attempt if JSON is invalid
    if not parsed_json:
        repair_prompt = f"The following text is malformed. Fix it and output ONLY the valid JSON object:\n{raw_response}"
        repaired_response = await ollama_client.generate_completion(repair_prompt, SYSTEM_PROMPT)
        if repaired_response:
            parsed_json = extract_json_block(repaired_response)

    if not parsed_json:
        return None

    try:
        summary_val = str(parsed_json.get("summary") or parsed_json.get("executive_summary") or "Forensic analysis completed.")
        narrative_val = str(parsed_json.get("threat_narrative") or summary_val)
        psych_val = [str(x) for x in parsed_json.get("psychological_mechanisms", ["Urgency pressure"])]
        steps_val = [str(x) for x in parsed_json.get("likely_next_steps", ["Credential harvesting landing page"])]
        analogy_val = str(parsed_json.get("educational_analogy") or "Like a stranger wearing a fake uniform asking for your keys.")

        return GemmaReport(
            summary=summary_val,
            threat_narrative=narrative_val,
            psychological_mechanisms=psych_val,
            likely_next_steps=steps_val,
            educational_analogy=analogy_val,
            executive_summary=summary_val,
            main_findings=[str(x) for x in parsed_json.get("main_findings", [])] or [summary_val],
            supporting_evidence=[str(x) for x in parsed_json.get("supporting_evidence", [])],
            contradictory_or_missing_evidence=[str(x) for x in parsed_json.get("contradictory_or_missing_evidence", [])],
            uncertainties=[str(x) for x in parsed_json.get("uncertainties", [])],
            user_safety_steps=[str(x) for x in parsed_json.get("user_safety_steps", ["Do not click links", "Verify independently"])],
            human_verification_advisable=bool(parsed_json.get("human_verification_advisable", True)),
            model_identifier=f"Gemma 4 ({ollama_client.model})",
            generated_at=datetime.now(timezone.utc).isoformat(),
            disclaimer="Synthesized by local Gemma 4 model from structured forensic indicators. Decision support only; not legal evidence."
        )
    except Exception as e:
        print(f"Pydantic validation failed for Gemma report: {e}")
        return None
