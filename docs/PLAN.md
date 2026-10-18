# ScamTrace AI — Master Architecture & Implementation Plan

> **Tagline:** *"Don't just detect the scam. Expose the evidence behind it."*  
> **Repository:** `C:\Users\PRACHI\OneDrive\Desktop\ScamTraceAI`  
> **Target Platform:** Web (Desktop-first responsive, Open Source, GitHub Pages + Backend API deployable)

---

## 1. System Reconnaissance Summary

| Component | Detected Specification | Note / Action |
|---|---|---|
| **OS** | Windows 11 (64-bit) | PowerShell CLI execution |
| **Python** | 3.14.6 | Standard venv for dependencies |
| **Node.js** | v24.21.0 | Vite + React + TypeScript |
| **npm** | 11.19.0 | Monorepo frontend dependency manager |
| **RAM** | ~16 GB (16,462,712 KB) | High capacity for lightweight local LLM |
| **GPU** | Intel(R) UHD Graphics (Family) | CPU-optimized local inference |
| **Ollama Status** | Downloading v0.40.5 via winget | Target tag: `gemma4:e2b` (or `gemma3:1b` / fallback gracefully if offline) |
| **Phishing Dataset** | `phishing_features.csv` located (16.1 MB) | Copied to `/data/raw/phishing_features.csv` (gitignored) |
| **SMS Dataset** | Canonical UCI SMS Spam Collection | Extracted & prepared at `/data/raw/` |

---

## 2. Core Architecture & Monorepo Structure

```
ScamTraceAI/
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Pytest + TSC + Vitest + Vite Build
│       └── deploy-pages.yml           # Static build to GitHub Pages
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py                  # Env config & Pydantic settings
│   │   ├── database.py                # SQLite + SQLAlchemy session
│   │   ├── models/
│   │   │   ├── db_models.py           # Investigation, Feedback, Campaign tables
│   │   │   └── schemas.py             # Typed Pydantic request/response schemas
│   │   ├── engine/
│   │   │   ├── validator.py           # Untrusted input sanitization & bounds
│   │   │   ├── lexical_url.py         # 100% offline local URL feature extractor
│   │   │   ├── evidence_extractor.py  # Rule-based span detection & context flags
│   │   │   ├── risk_scorer.py         # Multi-factor score with plain-text rationale
│   │   │   ├── entity_extractor.py    # Masked PII, brands, template fingerprints
│   │   │   └── campaign_matcher.py    # TF-IDF cosine similarity clustering
│   │   ├── ml/
│   │   │   ├── predictor.py           # Model loader & inference wrapper
│   │   │   └── calibrator.py          # Calibrated probability safeguards
│   │   ├── llm/
│   │   │   ├── ollama_client.py       # Ollama integration with timeout & error handling
│   │   │   └── report_generator.py    # Structured JSON prompt, repair & validation
│   │   └── routes/
│   │       ├── health.py              # Health check, version, model statuses
│   │       ├── investigations.py      # CRUD + Graph + Analysis endpoints
│   │       ├── campaigns.py           # Campaign intelligence & clustering
│   │       ├── models_api.py          # Real model metrics & live predictions
│   │       └── feedback.py            # User feedback & contact form
│   ├── main.py                        # FastAPI entrypoint, CORS, rate limits
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── assets/                    # Static branding & icons
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx         # Sticky header with shrink-on-scroll
│   │   │   │   ├── Footer.tsx         # Wordmark, links, build date
│   │   │   │   ├── MobileMenu.tsx     # Accessible drawer with focus trap
│   │   │   │   └── SkipLink.tsx       # Accessible skip-to-content
│   │   │   ├── common/
│   │   │   │   ├── DarkModeToggle.tsx # Light/Dark/System persistent toggle
│   │   │   │   ├── CookieBanner.tsx   # Essential storage consent banner
│   │   │   │   ├── CommandPalette.tsx # Ctrl+K site search
│   │   │   │   ├── ScrollProgress.tsx # Top progress indicator
│   │   │   │   ├── BackToTop.tsx      # Smooth scroll-to-top button
│   │   │   │   ├── FeedbackModal.tsx  # Floating contact/feedback modal
│   │   │   │   └── Toast.tsx          # Real-time copy & feedback alerts
│   │   │   ├── home/
│   │   │   │   ├── Preloader.tsx      # Evidence tape unrolling animation
│   │   │   │   ├── PullMeHero.tsx     # Draggable tape interactive hero
│   │   │   │   ├── KineticHeadline.tsx# Bold word/letter kinetic reveal
│   │   │   │   ├── MarqueeBand.tsx    # Educational tip ticker with pause
│   │   │   │   ├── ScrollStory.tsx    # To Detect / To Explain / To Protect
│   │   │   │   └── ScamSlider.tsx     # Flip-card slider for scam archetypes
│   │   │   └── investigation/
│   │   │       ├── EvidenceFeed.tsx   # Highlighted text spans & indicator list
│   │   │       ├── RiskGauge.tsx      # Real computed risk gauge with label
│   │   │       ├── SafetyPlaybook.tsx # Actionable user safety checklist
│   │   │       ├── GraphView.tsx      # React Flow interactive investigation canvas
│   │   │       └── GemmaReportView.tsx# AI report / honest offline fallback
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── CommandCenter.tsx      # Operations dashboard
│   │   │   ├── NewInvestigation.tsx   # Main investigation analysis workspace
│   │   │   ├── InvestigationGraph.tsx # Global entity relationship graph
│   │   │   ├── CampaignIntel.tsx      # Cluster & pattern intelligence
│   │   │   ├── ModelLab.tsx           # Real confusion matrices & metrics
│   │   │   ├── History.tsx            # Saved investigations table & filter
│   │   │   ├── ScamAcademy.tsx        # Educational lessons & interactive quiz
│   │   │   ├── About.tsx              # Methodology, privacy & provenance
│   │   │   ├── Settings.tsx           # Model status, demo mode & admin pass
│   │   │   └── NotFound.tsx           # Accessible 404 page
│   │   ├── context/
│   │   │   └── ThemeContext.tsx       # Persisted theme management
│   │   ├── services/
│   │   │   └── api.ts                 # Typed fetch client with mock/demo fallback
│   │   ├── types/
│   │   │   └── index.ts               # Shared TypeScript interfaces
│   │   ├── styles/
│   │   │   └── index.css              # Custom Tailwind tokens & print styles
│   │   ├── App.tsx                    # HashRouter routing & layout shell
│   │   └── main.tsx                   # React root
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── data/
│   └── raw/                           # Gitignored datasets
├── models/                            # Trained joblib artifacts + metrics JSON
├── docs/
│   ├── PLAN.md                        # This plan
│   ├── data_report.md                 # Automated dataset analysis
│   └── references/                    # Architectural notes & wireframes
├── scripts/
│   ├── inspect_data.py                # Dataset profiler
│   ├── train_message.py               # SMS Spam/Ham ML trainer & evaluator
│   ├── train_url.py                   # Lexical URL ML trainer & evaluator
│   └── train_all.py                   # Master training pipeline
├── .env.example
├── .gitignore
├── LICENSE                            # MIT License + third-party disclaimers
└── README.md                          # Comprehensive open-source documentation
```

---

## 3. Strict Design Tokens (WCAG AA Compliant)

| Token Name | Hex Code | Light Mode Role | Dark Mode Role |
|---|---|---|---|
| `--color-crimson` | `#A82020` | Primary buttons, urgent tags | Borders, key accents, alert icons |
| `--color-crimson-light`| `#E04040` | Hover states | Text on dark (accessible contrast) |
| `--color-maroon` | `#6C1A1A` | Secondary headings, borders | Panel surfaces, deep headers |
| `--color-cream` | `#F3E6D5` | Background canvas | Primary typography & icons |
| `--color-peach` | `#FBE6C2` | Raised surfaces, card panels | Accent text, secondary highlights |
| `--color-bg-dark` | `#1A0707` | N/A | Deep canvas background |
| `--color-surface-dark`| `#2A0D0D` | N/A | Elevated card & modal surfaces |
| `--color-text-light`| `#2A0E0E` | High-contrast body typography | N/A |
| `--color-warn-amber`| `#C27803` | "Suspicious" semantic chip | "Suspicious" semantic chip |
| `--color-safe-teal` | `#1E6E60` | "Lower concern" semantic chip | "Lower concern" semantic chip |

---

## 4. Phase-by-Phase Execution & Gate Milestones

### Phase 0: Recon and Plan (Current)
- **Status:** Complete
- **Gate:** Plan document created, environment audited, initial dataset copied to `/data/raw/phishing_features.csv`, SMS dataset acquired from official repository.

### Phase 1: Scaffold Frontend + Backend + SQLite + Design Tokens
- Set up FastAPI app structure with CORS, health routes, SQLite engine.
- Initialize React + Vite + TypeScript frontend with Tailwind, Lucide icons, Framer Motion, HashRouter.
- Implement theme provider, sticky header, mobile drawer, cookie banner, scroll progress, footer.
- **Gate:** Backend starts, `GET /api/health` returns `{"status": "healthy"}`; frontend typechecks (`tsc --noEmit`) and Vite builds cleanly.

### Phase 2: Data Profiling, Offline Lexical URL & Message Classifiers
- Run data inspection script to generate `docs/data_report.md`.
- Extract only locally-computable lexical features from URLs (no DNS, no HTTP requests).
- Train message classifier (TF-IDF + Calibrated Logistic Regression) and URL classifier (Random Forest/Logistic Regression).
- Save artifacts in `/models/` and export evaluation metrics (confusion matrices, F1, precision, recall) to JSON.
- **Gate:** `python -m scripts.train_all` completes; held-out test metrics JSON generated; zero label leakage.

### Phase 3: Investigation Engine & Backend API
- Implement input validation, lexical extractor, rule-based evidence span matcher, multi-factor risk scoring.
- Store investigations in SQLite database; create endpoints for CRUD, graph data, campaigns.
- Write backend pytest suite.
- **Gate:** Pytest passes 100%; sample investigation round-trips through DB and returns structured analysis.

### Phase 4: New Investigation Workspace UI
- Build the 3-column incident command workspace: input/examples, progress stages, evidence feed with highlighted spans, safety playbook, risk gauge.
- Wire to backend API; include copy summary and print stylesheet.
- **Gate:** End-to-end investigation run and verified in browser.

### Phase 5: Investigation Graph & Campaign Intelligence
- React Flow graph canvas: nodes (investigations, URLs, phone numbers, brands, templates), edges (CONTAINS, SHARES INDICATOR).
- Campaign clustering via TF-IDF cosine similarity.
- **Gate:** Two related submissions show linked edges and campaign cluster view.

### Phase 6: Gemma 4 / Ollama AI Report Generation
- Connect to local Ollama instance (`gemma4:e2b` or configured model).
- Strict Pydantic JSON schema output with single automated repair fallback.
- Explicit and honest offline fallback state when Ollama is unreachable.
- **Gate:** Structured report generated or graceful unavailable state confirmed.

### Phase 7: Interactive Landing Page & Scam Academy
- Preloader (evidence tape unroll), draggable "PULL ME" hero, kinetic typography, marquee bands, scroll storytelling, scam-type card slider.
- Scam Academy: lessons, glossary, region-aware reporting resources (India Cybercrime 1930 / cybercrime.gov.in verified), interactive Spot-the-Scam quiz.
- **Gate:** Smooth animations with reduced-motion support, keyboard accessible, verified resources.

### Phase 8: Site-Wide Features, History, Command Center, Settings
- Complete all 20 site-wide features (dark mode, cookie banner, Ctrl+K search, back-to-top, mobile drawer, skeletons, UTM capture, feedback form, confirmation modals, etc.).
- Complete Command Center, Model Lab, History, and Settings pages.
- **Gate:** All 20 site-wide features verified functional in browser.

### Phase 9: Security Hardening, Production Build & GitHub Deployment
- Security review: sanitize inputs, CORS, rate limits, no secret leakage.
- GitHub Actions CI (`ci.yml`) and GitHub Pages deployment (`deploy-pages.yml`).
- Dockerfile + deployment configuration for cloud backend.
- Comprehensive `README.md` with instructions, citations, and benchmark metrics.
- **Gate:** All tests pass, production build succeeds, repo ready for push.
