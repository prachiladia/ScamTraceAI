import os
import json
import hashlib
from datetime import datetime, timezone
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix
)

FEATURES = [
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

def compute_file_hash(filepath: str) -> str:
    hasher = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def train_url_model():
    print("=" * 60)
    print("ScamTrace AI: Training Lexical Offline URL Classifier")
    print("=" * 60)

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, "data", "raw", "phishing_features.csv")
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found.")
        return

    dataset_hash = compute_file_hash(data_path)
    print("Loading phishing dataset...")
    df = pd.read_csv(data_path)

    # Sanity checks
    df = df.dropna(subset=FEATURES + ["label"]).reset_index(drop=True)
    initial_count = len(df)
    
    # Deduplicate URLs (Rule A.4)
    df = df.drop_duplicates(subset=["url"]).reset_index(drop=True)
    deduped_count = len(df)
    print(f"Dataset rows: {initial_count} | Unique URLs: {deduped_count}")

    X = df[FEATURES]
    y = df["label"].astype(int)

    print(f"Class distribution: Legitimate (0) = {(y == 0).sum()}, Phishing (1) = {(y == 1).sum()}")

    # Stratified Train/Val/Test Split: 70% train, 15% validation, 15% held-out test
    SEED = 42
    X_train_val, X_test, y_train_val, y_test = train_test_split(
        X, y, test_size=0.15, random_state=SEED, stratify=y
    )
    X_train, X_val, y_train, y_val = train_test_split(
        X_train_val, y_train_val, test_size=0.1765, random_state=SEED, stratify=y_train_val
    )

    print(f"Splits: Train = {len(X_train)}, Val = {len(X_val)}, Test = {len(X_test)}")
    print(f"Test Class 0 support: {(y_test == 0).sum()} | Test Class 1 support: {(y_test == 1).sum()}")

    # Model: Random Forest with balanced class weights for imbalanced support
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=12,
        class_weight="balanced",
        random_state=SEED,
        n_jobs=-1
    )

    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("rf", model)
    ])

    print("Fitting Random Forest pipeline on training split...")
    pipeline.fit(X_train, y_train)

    # Validation evaluation
    val_preds = pipeline.predict(X_val)
    val_f1 = f1_score(y_val, val_preds)
    print(f"Validation F1 Score: {val_f1:.4f}")

    # Held-out Test evaluation ONLY (Rule A.4)
    print("\nEvaluating on Held-Out Test Set...")
    test_preds = pipeline.predict(X_test)
    test_probs = pipeline.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, test_preds)
    prec = precision_score(y_test, test_preds)
    rec = recall_score(y_test, test_preds)
    f1 = f1_score(y_test, test_preds)
    roc_auc = roc_auc_score(y_test, test_probs)
    cm = confusion_matrix(y_test, test_preds).tolist()

    # Feature Importances
    rf_step = pipeline.named_steps["rf"]
    importances = {
        feat: round(float(imp), 4)
        for feat, imp in zip(FEATURES, rf_step.feature_importances_)
    }
    # Sort descending
    importances = dict(sorted(importances.items(), key=lambda item: item[1], reverse=True))

    print(f"Test Accuracy:  {acc*100:.2f}%")
    print(f"Test Precision: {prec*100:.2f}%")
    print(f"Test Recall:    {rec*100:.2f}%")
    print(f"Test F1 Score:  {f1*100:.2f}%")
    print(f"Test ROC AUC:   {roc_auc:.4f}")
    print(f"Confusion Matrix [TN, FP / FN, TP]: {cm}")
    print(f"Top Feature Importances:\n{json.dumps(importances, indent=2)}")

    # Save model artifact
    model_output_path = os.path.join(models_dir, "url_classifier.joblib")
    joblib.dump(pipeline, model_output_path)
    print(f"\nSaved model artifact to: {model_output_path}")

    # Save detailed evaluation metadata JSON
    metrics_data = {
        "model_name": "LexicalUrlClassifier-RandomForest",
        "model_version": "v1.0.0",
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "dataset_name": "Phishing URLs with Extracted Features (Victus Adi)",
        "dataset_sha256": dataset_hash,
        "split_seed": SEED,
        "features_used": FEATURES,
        "excluded_features_rationale": "Non-lexical features requiring external network queries (WHOIS, DNS, web content) were excluded per Rule A.6 to guarantee 100% offline local privacy-safe analysis.",
        "sample_counts": {
            "total_raw": initial_count,
            "deduplicated": deduped_count,
            "train": len(X_train),
            "val": len(X_val),
            "test": len(X_test),
        },
        "class_support_test": {
            "legitimate_url": int((y_test == 0).sum()),
            "phishing_url": int((y_test == 1).sum()),
        },
        "test_metrics": {
            "accuracy": round(float(acc), 4),
            "precision": round(float(prec), 4),
            "recall": round(float(rec), 4),
            "f1": round(float(f1), 4),
            "roc_auc": round(float(roc_auc), 4),
            "confusion_matrix": cm,
        },
        "feature_importances": importances,
        "target_mapping": {
            "0": "legitimate_url",
            "1": "phishing_url"
        },
        "disclaimer": "Metrics computed strictly on held-out test partition. Zero network or DNS queries are performed during inference."
    }

    metrics_output_path = os.path.join(models_dir, "url_classifier_metrics.json")
    with open(metrics_output_path, 'w', encoding='utf-8') as f:
        json.dump(metrics_data, f, indent=2)
    print(f"Saved evaluation metrics to: {metrics_output_path}")

if __name__ == "__main__":
    train_url_model()
