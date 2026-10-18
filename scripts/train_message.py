import os
import json
import hashlib
from datetime import datetime, timezone
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, brier_score_loss
)
from sklearn.pipeline import Pipeline

def compute_file_hash(filepath: str) -> str:
    hasher = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def train_message_model():
    print("=" * 60)
    print("ScamTrace AI: Training Message / SMS Deception Classifier")
    print("=" * 60)

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, "data", "raw", "spam.csv")
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found. Please place spam.csv in data/raw/")
        return

    dataset_hash = compute_file_hash(data_path)
    df = pd.read_csv(data_path)

    # Support different column names if user provided a Kaggle variant
    if 'v1' in df.columns and 'v2' in df.columns:
        df = df[['v1', 'v2']].rename(columns={'v1': 'label', 'v2': 'text'})
    
    # Clean and sanitize labels
    df = df.dropna(subset=['text', 'label'])
    df['text'] = df['text'].astype(str)
    
    # Map label to binary target (1 = spam_related, 0 = neutral_ham)
    df['target'] = df['label'].astype(str).str.lower().apply(lambda x: 1 if 'spam' in x else 0)

    # Leakage check: Deduplicate messages before splitting (Rule A.4)
    initial_count = len(df)
    df = df.drop_duplicates(subset=['text']).reset_index(drop=True)
    deduped_count = len(df)
    print(f"Dataset rows: {initial_count} | After deduplication: {deduped_count} (dropped {initial_count - deduped_count} duplicates)")
    print(f"Class balance: Ham = {(df['target'] == 0).sum()} ({(df['target'] == 0).mean()*100:.1f}%), Spam = {(df['target'] == 1).sum()} ({(df['target'] == 1).mean()*100:.1f}%)")

    # Stratified Train/Val/Test Split: 70% train, 15% validation, 15% held-out test
    SEED = 42
    X_train_val, X_test, y_train_val, y_test = train_test_split(
        df['text'], df['target'], test_size=0.15, random_state=SEED, stratify=df['target']
    )
    X_train, X_val, y_train, y_val = train_test_split(
        X_train_val, y_train_val, test_size=0.1765, random_state=SEED, stratify=y_train_val # 0.85 * 0.1765 ≈ 0.15
    )

    print(f"Splits: Train = {len(X_train)}, Val = {len(X_val)}, Test = {len(X_test)}")

    # Check for split contamination
    train_set = set(X_train)
    val_overlap = sum(1 for t in X_val if t in train_set)
    test_overlap = sum(1 for t in X_test if t in train_set)
    print(f"Data leakage check: Train/Val overlap = {val_overlap}, Train/Test overlap = {test_overlap}")
    assert val_overlap == 0 and test_overlap == 0, "Data leakage detected across splits!"

    # TF-IDF Vectorizer fit on X_train ONLY
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=5000,
        sublinear_tf=True,
        stop_words='english'
    )

    base_clf = LogisticRegression(
        C=2.0,
        class_weight='balanced',
        max_iter=1000,
        random_state=SEED
    )

    # Calibrated Classifier for genuine probability estimation (Rule A.5 / Section E)
    calibrated_clf = CalibratedClassifierCV(
        estimator=base_clf,
        method='sigmoid',
        cv=3
    )

    pipeline = Pipeline([
        ('tfidf', vectorizer),
        ('clf', calibrated_clf)
    ])

    print("Fitting model pipeline on training split...")
    pipeline.fit(X_train, y_train)

    # Validation check
    val_preds = pipeline.predict(X_val)
    val_f1 = f1_score(y_val, val_preds)
    print(f"Validation F1 Score: {val_f1:.4f}")

    # Final Evaluation on Held-Out Test Set ONLY (Rule A.4)
    print("\nEvaluating on Held-Out Test Set...")
    test_preds = pipeline.predict(X_test)
    test_probs = pipeline.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, test_preds)
    prec = precision_score(y_test, test_preds)
    rec = recall_score(y_test, test_preds)
    f1 = f1_score(y_test, test_preds)
    roc_auc = roc_auc_score(y_test, test_probs)
    brier = brier_score_loss(y_test, test_probs)
    cm = confusion_matrix(y_test, test_preds).tolist() # [[TN, FP], [FN, TP]]

    print(f"Test Accuracy:  {acc*100:.2f}%")
    print(f"Test Precision: {prec*100:.2f}%")
    print(f"Test Recall:    {rec*100:.2f}%")
    print(f"Test F1 Score:  {f1*100:.2f}%")
    print(f"Test ROC AUC:   {roc_auc:.4f}")
    print(f"Brier Score (Calibration error): {brier:.4f}")
    print(f"Confusion Matrix [TN, FP / FN, TP]: {cm}")

    # Save artifact
    model_output_path = os.path.join(models_dir, "message_classifier.joblib")
    joblib.dump(pipeline, model_output_path)
    print(f"\nSaved model artifact to: {model_output_path}")

    # Save detailed evaluation metadata JSON
    metrics_data = {
        "model_name": "MessageClassifier-TFIDF-CalibratedLR",
        "model_version": "v1.0.0",
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "dataset_name": "SMS Spam Collection (Deduplicated)",
        "dataset_sha256": dataset_hash,
        "split_seed": SEED,
        "sample_counts": {
            "total_raw": initial_count,
            "deduplicated": deduped_count,
            "train": len(X_train),
            "val": len(X_val),
            "test": len(X_test),
        },
        "class_support_test": {
            "neutral_ham": int((y_test == 0).sum()),
            "spam_related": int((y_test == 1).sum()),
        },
        "test_metrics": {
            "accuracy": round(float(acc), 4),
            "precision": round(float(prec), 4),
            "recall": round(float(rec), 4),
            "f1": round(float(f1), 4),
            "roc_auc": round(float(roc_auc), 4),
            "brier_score": round(float(brier), 4),
            "confusion_matrix": cm,
        },
        "is_calibrated": True,
        "target_mapping": {
            "0": "neutral_ham",
            "1": "spam_related"
        },
        "disclaimer": "Metrics computed strictly on held-out test partition. Label 'spam_related' indicates deceptive/unsolicited pattern match, NOT criminal proof."
    }

    metrics_output_path = os.path.join(models_dir, "message_classifier_metrics.json")
    with open(metrics_output_path, 'w', encoding='utf-8') as f:
        json.dump(metrics_data, f, indent=2)
    print(f"Saved evaluation metrics to: {metrics_output_path}")

if __name__ == "__main__":
    train_message_model()
