import re
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from backend.app.models.db_models import Investigation, CampaignCluster

def find_related_investigations(
    current_text: str,
    stored_investigations: List[Investigation],
    threshold: float = 0.70
) -> List[Dict[str, Any]]:
    """
    Computes TF-IDF cosine similarity between the current input and past investigations.
    Wording guideline: Strictly labels matches as 'possible related activity, not confirmed attribution'.
    """
    if not stored_investigations:
        return []

    corpus = [inv.input_text for inv in stored_investigations]
    all_texts = [current_text] + corpus

    try:
        vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=1000, stop_words="english")
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        sim_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

        matches = []
        for idx, score in enumerate(sim_scores):
            if score >= threshold:
                matched_inv = stored_investigations[idx]
                matches.append({
                    "investigation_id": matched_inv.id,
                    "similarity_score": round(float(score), 3),
                    "created_at": matched_inv.created_at.isoformat() if matched_inv.created_at else None,
                    "risk_level": matched_inv.risk_level,
                    "note": "Possible related activity based on lexical phrase overlap; not confirmed attribution."
                })

        return sorted(matches, key=lambda x: x["similarity_score"], reverse=True)
    except Exception as e:
        print(f"Error computing campaign similarities: {e}")
        return []
