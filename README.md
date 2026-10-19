<<<<<<< HEAD
# SCAMTRACE AI

> **"Don't just detect the scam. Expose the evidence behind it."**

[![License: MIT](https://img.shields.io/badge/License-MIT-crimson.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-6C1A1A.svg)](https://www.python.org/)
[![React 19](https://img.shields.io/badge/React-19-F3E6D5.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-purple.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![WCAG AA Compliant](https://img.shields.io/badge/Accessibility-WCAG%20AA-teal.svg)](#accessibility--design-system)

ScamTrace AI is an open-source, applied machine learning and forensic cybersecurity decision-support web platform. It deconstructs deceptive messages, analyzes malicious URLs **strictly offline without network resolution**, isolates psychological manipulation tactics, generates relationship graph intelligence across cases, and provides users with a calm, actionable self-defense playbook.

---

## Table of Contents
1. [Core Philosophy & Guardrails](#core-philosophy--guardrails)
2. [Interactive Experience & Design System](#interactive-experience--design-system)
3. [Trained Models & Verified Evaluation Metrics](#trained-models--verified-evaluation-metrics)
4. [Strict Offline Lexical URL Engine](#strict-offline-lexical-url-engine)
5. [Local Gemma Explanatory AI & Fallback](#local-gemma-explanatory-ai--fallback)
6. [System Architecture & Monorepo Layout](#system-architecture--monorepo-layout)
7. [Installation & Windows PowerShell Setup](#installation--windows-powershell-setup)
8. [Running Verification Gates & Test Suites](#running-verification-gates--test-suites)
9. [Emergency Victim Reporting Directory](#emergency-victim-reporting-directory)
10. [Responsible AI & Limitations](#responsible-ai--limitations)
11. [License & Acknowledgments](#license--acknowledgments)

---

## Core Philosophy & Guardrails

ScamTrace AI rejects the black-box opacity of conventional "AI scam checkers". It operates under non-negotiable engineering principles:

* **Strict Layer Separation:** Model probabilities, deterministic forensic rules, and language-model reasoning are strictly separated in code and UI. A high spam score is **never** presented as proof of financial fraud.
* **Zero Network Fetch Policy:** User-submitted URLs are **never** opened, resolved via DNS, or queried over HTTP. Features are computed locally and mathematically to prevent triggering attacker tokens or downloading drive-by exploits.
* **No Fabricated Numbers:** All metrics, confusion matrices, accuracy figures, and dashboard statistics reflect **real computed data**. Training data is never used for final evaluations, and demo fixtures are visibly marked `DEMO DATA`.
* **Non-Retaliatory Defense:** ScamTrace AI never advises retaliation, counter-scamming, or contacting attackers. Recommendations focus entirely on passive, protective user self-defense.
* **Honest Degraded States:** If the backend database, trained model artifacts, or local Ollama LLM are offline, the system clearly communicates an honest offline state rather than hallucinating or silently failing.

---

## Interactive Experience & Design System

ScamTrace AI features an interactive, editorial forensic design system inspired by tactile investigation aesthetics and the kinetic interaction philosophy of sweet-tape:

* **Tactile Evidence Tape Preloader:** An animated evidence/caution tape unrolling sequence (`DO NOT CROSS // FORENSIC INSPECTION`) that plays once per session, is skippable with `Esc`, and automatically bypassed under `prefers-reduced-motion`.
* **Draggable "PULL ME" Hero Element:** A physics-driven Framer Motion drag tab (`PULL TO UNCOVER EVIDENCE`) that snaps past a threshold to unroll forensic evidence and launch the investigation workspace, accompanied by an accessible keyboard alternative.
* **Kinetic Typography:** Word-by-word kinetic headline reveals: *"DON'T JUST DETECT THE SCAM. EXPOSE THE EVIDENCE."*
* **Continuous Educational Marquee:** High-contrast ticker bands of real, memorable scam prevention principles with pause-on-hover.
* **Storytelling Stacked Sections:** Three core product pillars—`TO DETECT`, `TO EXPLAIN`, `TO PROTECT`—featuring an interactive mini-dissector executing real-time backend extraction.
* **Scam Anatomy Library:** 8 interactive 3D flip-cards detailing how modern fraud operates, behavioral red flags, and counter-measures (OTP Interception, Fake KYC Freeze, Parcel Redelivery, Job Scams, Pig Butchering, etc.).
* **Incident Command Workspace (3-Column Layout):**
  * *Column 1:* Raw input, entity chips (URLs, masked phones, masked emails, template hashes), and risk gauge.
  * *Column 2:* Contextual interactive text spans with character-level highlights (urgency phrases, authority claims, credential demands, protective warnings).
  * *Column 3:* Dual model score breakdowns, local Gemma analytical report, and user safety playbook.
* **Interactive Investigation Graph (React Flow):** Node-link entity graph illustrating relationships between investigations, shared indicators (`SHARES_INDICATOR_WITH`), and 3-tab inspector (Node Details, Legend, Link Filters).

### Brand Color Palette (WCAG AA Compliant)

| Color Token | Hex Code | Light Theme Usage | Dark Theme Usage |
| :--- | :--- | :--- | :--- |
| **Crimson** | `#A82020` | Primary buttons, key accents | Primary buttons, accent borders |
| **Maroon** | `#6C1A1A` | Deep surface headings, borders | Structural accents, deep canvas |
| **Cream** | `#F3E6D5` | Default canvas background | High-contrast body text |
| **Peach** | `#FBE6C2` | Raised cards, highlight surfaces | Secondary accent text, tags |
| **Dark Maroon** | `#1A0707` | Derived deep contrast borders | Default dark canvas background |
| **Surface Dark** | `#2A0D0D` | Dark hover surfaces | Raised card background in dark |

---

## Trained Models & Verified Evaluation Metrics

All models were trained on stratified splits (70% train, 15% validation, 15% held-out test) with zero data leakage across splits. Metrics were evaluated **strictly on the unseen held-out test sets**.

### 1. SMS & Message Classifier (TF-IDF + Calibrated Logistic Regression)
* **Dataset:** Canonical SMS Spam Collection (Almeida & Gómez Hidalgo, UCI ML Repository).
* **Architecture:** Word (1-2 ngrams) and Character (3-5 ngrams) TF-IDF vectorizer + Platt-calibrated Logistic Regression.
* **Sample Sizes:** 5,572 total messages (4,825 ham, 747 spam). Held-out test set: 776 messages.
* **Held-Out Test Results:**
  * **Accuracy:** `97.68%`
  * **F1 Score:** `90.53%`
  * **Precision:** `93.48%`
  * **Recall:** `87.76%`
  * **ROC AUC:** `0.9908`
  * **Brier Calibration Score:** `0.0202` (exceptionally well-calibrated probabilities)
* **Confusion Matrix (Test Set):**
  $$\begin{bmatrix} 672 & 6 \\ 12 & 86 \end{bmatrix}$$
  *(True Negatives: 672, False Positives: 6, False Negatives: 12, True Positives: 86)*

### 2. Lexical URL Classifier (Balanced Random Forest)
* **Dataset:** Phishing URLs Dataset with Extracted Features (Victus Adi, Kaggle).
* **Architecture:** Random Forest (100 estimators, balanced class weights) evaluated purely over offline lexical features.
* **Sample Sizes:** 160,064 total URLs. Held-out test set: 24,010 URLs.
* **Held-Out Test Results:**
  * **Accuracy:** `100.0%`
  * **F1 Score:** `100.0%`
  * **Precision:** `100.0%`
  * **Recall:** `100.0%`
  * **ROC AUC:** `1.0000`
* **Confusion Matrix (Test Set):**
  $$\begin{bmatrix} 123 & 0 \\ 0 & 23,887 \end{bmatrix}$$

---

## Strict Offline Lexical URL Engine

To guarantee zero network exposure, ScamTrace AI analyzes URLs using 10 purely local mathematical and structural features:

1. **URL Length:** Total character count.
2. **Dot Count:** Count of '.' characters (identifying multi-subdomain obfuscation).
3. **HTTPS Presence:** Detects transport protocol.
4. **IP Address Host:** Regular expression check for direct IP address hosts (e.g. `http://192.168.1.1`).
5. **Path Subdirectories:** Count of `/` separators in path.
6. **Query Parameter Count:** Count of `&` parameter delimiters.
7. **Suspicious Keyword Density:** Detection of keywords (`login`, `verify`, `update`, `banking`, `secure`, `account`, `wallet`, `token`).
8. **Special Character Count:** Frequency of `@`, `?`, `=`, `%`, `-`, `_`.
9. **Digit Count:** Count of numeric characters in hostname and path.
10. **Shannon Character Entropy:** Local mathematical entropy formula quantifying randomness:
    $$H(X) = -\sum_{i=1}^{n} P(x_i) \log_2 P(x_i)$$

---

## Local Gemma Explanatory AI & Fallback

ScamTrace AI integrates with a local **Gemma model via Ollama** (`http://localhost:11434`) for qualitative threat synthesis:

* **Hardware Suitability:** Optimized for local consumer hardware (RAM: 16 GB, Intel UHD/discrete GPU). Recommended default: `gemma4:e2b` or `gemma:2b`.
* **Strict Pydantic Schema:** The LLM receives structured evidence items and outputs strict JSON matching:
  ```json
  {
    "summary": "1-2 sentence executive assessment",
    "threat_narrative": "Forensic narrative breakdown",
    "psychological_mechanisms": ["Artificial Urgency", "Authority Impersonation"],
    "likely_next_steps": ["Credential harvesting landing page"],
    "educational_analogy": "Real-world analogy explaining the trap",
    "user_safety_steps": ["Protective step 1", "Protective step 2"],
    "human_verification_advisable": true
  }
  ```
* **Controlled Repair:** If LLM output fails schema validation, the system initiates a single repair prompt. If validation still fails or Ollama is offline, the backend returns `gemma_report: null`.
* **Honest Fallback State:** The UI displays:
  > *"AI synthesis unavailable. Deterministic and model evidence above are fully functional."*
  Machine learning predictions, character spans, and safety rules remain 100% operational.
* **Model Identifier & Real License Terms:** Google Gemma is released under the **Gemma Terms of Use / Open Model License**, allowing commercial and non-commercial use subject to Google's Prohibited Use Policy.

---

## System Architecture & Monorepo Layout

```
ScamTraceAI/
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI routers (investigations, models, campaigns, feedback)
│   │   ├── engine/          # Forensic engine (validator, lexical URL, evidence extractor, risk scorer)
│   │   ├── llm/             # Ollama client and Gemma report generator
│   │   ├── models/          # Pydantic schemas and SQLAlchemy DB models
│   │   └── config.py        # Centralized settings and env validation
│   ├── tests/               # Pytest suite (investigation, graph, fallback tests)
│   └── main.py              # Application entrypoint and middleware
├── frontend/
│   ├── src/
│   │   ├── components/      # Sweet-tape preloader, draggable tab, marquee, graph, UI widgets
│   │   ├── context/         # ThemeContext (Dark/Light WCAG AA tokens)
│   │   ├── pages/           # Home, Workspace, Graph, Academy, ModelLab, History, Settings
│   │   ├── services/        # Backend API client with offline demo fixtures
│   │   └── index.css        # Tailwind CSS v4, custom tokens, print stylesheet
│   └── package.json         # React 19, Vite, Tailwind, React Flow, Recharts
├── data/
│   └── raw/                 # Raw datasets (gitignored): spam.csv, phishing_features.csv
├── models/                  # Serialized .joblib artifacts and evaluation metrics JSON
├── scripts/                 # Training scripts (train_message.py, train_url.py, inspect_data.py)
├── docs/                    # Architectural plans, data reports, and visual benchmarks
├── .github/workflows/       # CI (pytest + build) and GitHub Pages deployment
└── docker-compose.yml       # Production container orchestration
```

---

## Installation & Windows PowerShell Setup

Follow these exact steps to run the complete ScamTrace AI stack on Windows:

### 1. Clone & Environment Setup
```powershell
cd C:\Users\PRACHI\OneDrive\Desktop\ScamTraceAI

# Create and activate Python virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install backend dependencies
python -m pip install --upgrade pip
pip install -r backend/requirements.txt
```

### 2. Verify or Re-Train ML Models
The trained model artifacts are already included in `/models`. To re-train from raw datasets:
```powershell
.\.venv\Scripts\python -m scripts.train_all
```

### 3. Launch Backend API Server
```powershell
.\.venv\Scripts\python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
*API documentation and Swagger UI will be live at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)*

### 4. Launch Frontend Application
In a separate PowerShell window:
```powershell
cd C:\Users\PRACHI\OneDrive\Desktop\ScamTraceAI\frontend
npm install
npm run dev
```
*Web application will be live at: [http://localhost:5173](http://localhost:5173)*

### 5. Optional: Enable Local Gemma via Ollama
Ensure Ollama is running on your machine:
```powershell
ollama pull gemma4:e2b
# Or run with:
ollama run gemma4:e2b
```
*(If Ollama is not installed or running, ScamTrace AI automatically and honestly displays deterministic evidence).*

---

## Running Verification Gates & Test Suites

### Backend Pytest Suite (13 passing tests)
```powershell
.\.venv\Scripts\python -m pytest backend/tests/ -v
```

### Frontend Build & Typecheck
```powershell
cd frontend
npm run build
```

---

## Emergency Victim Reporting Directory

If you or someone you know has been targeted or shared sensitive information within the last 2 hours:

* **India (MHA & I4C):**
  * **National Cybercrime Helpline:** Dial **`1930`** (24/7 toll-free) immediately to freeze fraudulent bank transfers in transit.
  * **National Portal:** File an official complaint at [cybercrime.gov.in](https://cybercrime.gov.in).
  * **Chakshu Telecom Portal:** Report fraudulent SMS sender IDs and WhatsApp calls at [sancharsaathi.gov.in/sfc](https://sancharsaathi.gov.in/sfc).
* **United States:**
  * **FBI Internet Crime Complaint Center (IC3):** [ic3.gov](https://www.ic3.gov)
  * **Federal Trade Commission (FTC):** [reportfraud.ftc.gov](https://reportfraud.ftc.gov)
* **United Kingdom:**
  * **Action Fraud:** Dial `0300 123 2040` or visit [actionfraud.police.uk](https://www.actionfraud.police.uk).
  * **Free SMS Scam Reporting:** Forward suspicious texts to **`7726`** (SPAM).
* **Global / International:**
  * **Anti-Phishing Working Group (APWG):** [apwg.org](https://apwg.org)

---

## Responsible AI & Limitations

1. **Decision Support Only:** ScamTrace AI provides technical and behavioral decision support. Its scores and reports do not constitute legal evidence, statutory expert testimony, or law enforcement certification.
2. **No Attribution:** We do not identify physical perpetrators, locate phone number ownership, or trace ISP subscribers.
3. **Data Privacy:** Raw message text is processed in-memory. Masks are automatically applied to telephone numbers, emails, and payment IDs before entity persistence.

---

## License & Acknowledgments

* **Codebase:** Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
* **Datasets:**
  * *SMS Spam Collection:* Tiago A. Almeida and José María Gómez Hidalgo.
  * *Phishing URLs with Extracted Features:* Victus Adi (CC BY-SA 4.0).
* **AI Model Terms:** Google Gemma is utilized under the Google Gemma Terms of Use.
