import os
import joblib
import pandas as pd
from typing import Optional, List, Dict, Any

from backend.app.config import settings
from backend.app.models.schemas import ModelPrediction
from backend.app.engine.lexical_url import extract_lexical_features

URL_FEATURES = [
    "url_length",
    "num_dots",
    "has_https",
    "has_ip",
    "num_subdirs",
    "num_params",
    "suspicious_words",
    "special_char_count",
    "digits_count",
    "entropy"
]

class ModelPredictor:
    def __init__(self):
        self.message_pipeline = None
        self.url_pipeline = None
        self.load_models()

    def load_models(self):
        models_dir = settings.MODELS_DIR
        msg_path = os.path.join(models_dir, "message_classifier.joblib")
        url_path = os.path.join(models_dir, "url_classifier.joblib")

        if os.path.exists(msg_path):
            try:
                self.message_pipeline = joblib.load(msg_path)
            except Exception as e:
                print(f"Warning: Failed to load message model: {e}")

        if os.path.exists(url_path):
            try:
                self.url_pipeline = joblib.load(url_path)
            except Exception as e:
                print(f"Warning: Failed to load URL model: {e}")

    def predict_message(self, text: str) -> Optional[ModelPrediction]:
        if not self.message_pipeline:
            return None

        try:
            # Predict class and calibrated probability
            probs = self.message_pipeline.predict_proba([text])[0]
            spam_prob = float(probs[1])
            predicted_class = "spam_related" if spam_prob >= 0.5 else "neutral_ham"

            # Feature attribution / active keywords
            tfidf = self.message_pipeline.named_steps.get("tfidf")
            features_used = []
            if tfidf:
                feature_names = tfidf.get_feature_names_out()
                tokens = text.lower().split()
                matched_features = [w for w in set(tokens) if w in feature_names]
                features_used = matched_features[:10]

            return ModelPrediction(
                model_name="MessageClassifier-TFIDF-CalibratedLR",
                model_version="v1.0.0",
                predicted_class=predicted_class,
                score_type="calibrated_probability",
                score=round(spam_prob, 4),
                features_used=features_used,
                raw_scores={"neutral_ham": round(float(probs[0]), 4), "spam_related": round(spam_prob, 4)}
            )
        except Exception as e:
            print(f"Error during message inference: {e}")
            return None

    def predict_url(self, url: str) -> Optional[ModelPrediction]:
        if not self.url_pipeline or not url:
            return None

        try:
            lexical_feats = extract_lexical_features(url)
            feature_row = pd.DataFrame([{col: lexical_feats[col] for col in URL_FEATURES}])
            probs = self.url_pipeline.predict_proba(feature_row)[0]
            phish_prob = float(probs[1])
            predicted_class = "phishing_url" if phish_prob >= 0.5 else "legitimate_url"

            active_features = [
                f"{k}={v}" for k, v in lexical_feats.items()
                if k in URL_FEATURES and (v > 0 or k in ["url_length", "entropy"])
            ][:8]

            return ModelPrediction(
                model_name="LexicalUrlClassifier-RandomForest",
                model_version="v1.0.0",
                predicted_class=predicted_class,
                score_type="decision_score",
                score=round(phish_prob, 4),
                features_used=active_features,
                raw_scores={"legitimate_url": round(float(probs[0]), 4), "phishing_url": round(phish_prob, 4)}
            )
        except Exception as e:
            print(f"Error during URL inference: {e}")
            return None

predictor = ModelPredictor()
