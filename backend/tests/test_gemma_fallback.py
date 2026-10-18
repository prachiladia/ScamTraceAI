import pytest
from unittest.mock import AsyncMock, patch
from backend.app.llm.report_generator import extract_json_block, generate_gemma_report
from backend.app.models.schemas import EvidenceItem, ModelPrediction, GemmaReport

def test_extract_json_block_clean():
    text = '{"summary": "Test summary", "threat_narrative": "Urgent SMS", "psychological_mechanisms": ["Fear", "Urgency"], "likely_next_steps": ["Block sender"], "educational_analogy": "Digital counterfeit"}'
    res = extract_json_block(text)
    assert res is not None
    assert res["summary"] == "Test summary"

def test_extract_json_block_markdown():
    text = 'Here is the analysis:\n```json\n{"summary": "Markdown test", "threat_narrative": "Fake lottery", "psychological_mechanisms": ["Greed"], "likely_next_steps": ["Delete"], "educational_analogy": "Hook"}\n```'
    res = extract_json_block(text)
    assert res is not None
    assert res["summary"] == "Markdown test"

def test_extract_json_block_invalid():
    text = "This is pure text with no JSON braces anywhere."
    res = extract_json_block(text)
    assert res is None

import asyncio

def test_generate_gemma_report_unavailable():
    async def _test():
        with patch("backend.app.llm.report_generator.ollama_client.is_available", new_callable=AsyncMock) as mock_avail:
            mock_avail.return_value = False
            evidence = [
                EvidenceItem(
                    id="ev-1",
                    type="urgency_phrase",
                    matched_text="immediately",
                    start_char=0,
                    end_char=11,
                    severity="high",
                    explanation="Urgency pressure tactic",
                    source_component="test_component",
                    confidence=0.95,
                    weight=1.5
                )
            ]
            res = await generate_gemma_report(
                evidence=evidence,
                risk_level="HIGH",
                risk_score=78.5,
                message_pred=None,
                url_pred=None
            )
            # Must return None honestly, not fake data
            assert res is None

    asyncio.run(_test())

def test_generate_gemma_report_successful_parsing():
    async def _test():
        mock_json_response = '''{
            "executive_summary": "Urgent payment threat.",
            "summary": "Urgent payment threat.",
            "threat_narrative": "User is pressured to pay fake fee.",
            "psychological_mechanisms": ["Artificial Urgency", "Fear of Suspension"],
            "likely_next_steps": ["Requesting card details", "Phishing landing page"],
            "educational_analogy": "Like a fake courier at your door demanding cash.",
            "main_findings": ["Urgent phrase detected", "Suspicious domain"],
            "supporting_evidence": ["Matched 'immediately' keyword"],
            "contradictory_or_missing_evidence": [],
            "uncertainties": ["Sender identity unverified"],
            "user_safety_steps": ["Do not click", "Verify with official bank"],
            "human_verification_advisable": true
        }'''

        with patch("backend.app.llm.report_generator.ollama_client.is_available", new_callable=AsyncMock) as mock_avail, \
             patch("backend.app.llm.report_generator.ollama_client.generate_completion", new_callable=AsyncMock) as mock_comp:
            mock_avail.return_value = True
            mock_comp.return_value = mock_json_response

            evidence = [
                EvidenceItem(
                    id="ev-1",
                    type="urgency_phrase",
                    matched_text="immediately",
                    start_char=0,
                    end_char=11,
                    severity="high",
                    explanation="Urgency pressure tactic",
                    source_component="test_component",
                    confidence=0.95,
                    weight=1.5
                )
            ]
            res = await generate_gemma_report(
                evidence=evidence,
                risk_level="HIGH",
                risk_score=78.5,
                message_pred=None,
                url_pred=None
            )
            assert res is not None
            assert "Urgent payment threat" in res.summary
            assert "Artificial Urgency" in res.psychological_mechanisms
            assert res.human_verification_advisable is True

    asyncio.run(_test())
