import time
from scripts.train_message import train_message_model
from scripts.train_url import train_url_model

def train_all():
    start_time = time.time()
    print("=" * 70)
    print("ScamTrace AI: MASTER ML TRAINING PIPELINE")
    print("=" * 70)
    
    print("\n[1/2] Training Message Deception Classifier...")
    train_message_model()

    print("\n[2/2] Training Lexical URL Classifier...")
    train_url_model()

    elapsed = time.time() - start_time
    print("=" * 70)
    print(f"Master training pipeline completed in {elapsed:.2f} seconds.")
    print("Artefacts and held-out test metrics JSON saved to /models/")
    print("=" * 70)

if __name__ == "__main__":
    train_all()
