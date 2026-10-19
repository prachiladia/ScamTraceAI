# SCAMTRACE AI — Cinematic SOC Threat-Intelligence Redesign Report

**Branch:** `redesign/cinematic`  
**Date:** October 2026  
**Status:** Complete, Verified, & Production-Ready  

---

## 1. Executive Summary & Design Vision

SCAMTRACE AI has been transformed from an experimental academic interface into a **cinematic, high-density cybersecurity operations and threat-intelligence platform**. Inspired by modern Security Operations Centers (SOCs) and elite intelligence platforms (e.g. Palantir, CrowdStrike Falcon, Datadog Security), the new aesthetic combines:

- **Ultra-deep background surfaces** (`#080D18`, `#101827`, `#141F30`, `#1B293B`)
- **Restrained Electric Cyan & Mint Teal accents** (`#22D3EE`, `#2DD4BF`) reserved exclusively for primary interactive states, active nav indicators, and focus reticles
- **Self-hosted geometric & technical typography** (`Space Grotesk`, `Inter`, `JetBrains Mono`)
- **Interactive canvas graph background** (`IntelligenceNetwork`) with real proximity linking, data packet pulses, cursor deflection, and battery-friendly static rendering under `prefers-reduced-motion`
- **Zero fake data or fabricated metrics** — all telemetry, case records, graph edges, and offline evaluation confusion matrices strictly reflect genuine SQLite database states and held-out scikit-learn models.

---

## 2. Design System Tokens & Color Architecture

All colors are declared as CSS custom variables in [index.css](file:///C:/Users/PRACHI/OneDrive/Desktop/ScamTraceAI/frontend/src/index.css) and exposed directly into Tailwind CSS v4 via `@theme`.

### Color Token Reference Table

| Token Name | Dark Theme Hex | Light Theme Hex | Role & Usage Restrictions |
| :--- | :--- | :--- | :--- |
| `--background` | `#080D18` | `#F8FAFC` | Base viewport background |
| `--background-secondary` | `#101827` | `#F1F5F9` | Secondary section background |
| `--surface` | `#141F30` | `#FFFFFF` | Standard card and container surface |
| `--surface-elevated` | `#1B293B` | `#E2E8F0` | Raised cards, modals, table headers |
| `--accent-primary` | `#22D3EE` | `#0891B2` | Primary buttons, active nav, focus rings |
| `--accent-secondary` | `#2DD4BF` | `#0D9488` | Secondary status icons, telemetry highlights |
| `--text-primary` | `#F1F5F9` | `#0F172A` | Headings, high-contrast values, titles |
| `--text-secondary` | `#94A3B8` | `#475569` | Body copy, table labels, supporting text |
| `--border-subtle` | `rgba(148,163,184,0.16)` | `rgba(15,23,42,0.12)` | Card borders, dividing rules, separators |
| `--risk-high` | `#F87171` | `#DC2626` | High concern findings (never used for buttons) |
| `--risk-warning` | `#FBBF24` | `#D97706` | Suspicious indicator alerts |
| `--risk-low` | `#2DD4BF` | `#0D9488` | Low concern / verified protective attributes |

> **Critical Design Rule:** Severity is **never** communicated by color alone. Every risk indicator utilizes the `SeverityChip` primitive, which binds an explicit SVG icon (`ShieldAlert`, `AlertTriangle`, `CheckCircle2`), uppercase text label (`High concern`, `Suspicious`, `Lower concern`), and WCAG AA-compliant background tokens.

---

## 3. Typography Architecture

Fonts are 100% self-hosted using `@fontsource` packages to guarantee complete offline zero-leak capability with zero external CDN dependencies:

1. **Space Grotesk (`500`, `700`):** Section display headings, hero typography, modal headers.
2. **Inter (`400`, `500`, `600`):** Body text, form controls, navigation items, analytical summaries. Base font size is 16px desktop / 15px mobile.
3. **JetBrains Mono (`400`, `500`, `700`):** Case IDs (`#INV-94021`), confidence metrics (`97.7%`), SHA256 hashes, timestamps, and model evaluation tables.

---

## 4. Shared UI Component Library

Located in `frontend/src/components/ui/`:

- [`Button.tsx`](file:///C:/Users/PRACHI/OneDrive/Desktop/ScamTraceAI/frontend/src/components/ui/Button.tsx): Variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), sizes (`sm`, `md`, `lg`), accessible loading spinner, and icon positioning.
- [`SeverityChip.tsx`](file:///C:/Users/PRACHI/OneDrive/Desktop/ScamTraceAI/frontend/src/components/ui/SeverityChip.tsx): Standardized risk display enforcing dual icon + text label semantics.
- [`Card.tsx`](file:///C:/Users/PRACHI/OneDrive/Desktop/ScamTraceAI/frontend/src/components/ui/Card.tsx) & [`Panel.tsx`](file:///C:/Users/PRACHI/OneDrive/Desktop/ScamTraceAI/frontend/src/components/ui/Panel.tsx): High-density container frames with optional status dots and header badges.
- [`BrandLogo.tsx`](file:///C:/Users/PRACHI/OneDrive/Desktop/ScamTraceAI/frontend/src/components/common/BrandLogo.tsx): Custom SVG reticle with interconnected graph nodes and dynamic cyan gradient.
- [`Input.tsx`](file:///C:/Users/PRACHI/OneDrive/Desktop/ScamTraceAI/frontend/src/components/ui/Input.tsx): Monospace input with prefix icon, helper text, and accessible error states.
- [`Modal.tsx`](file:///C:/Users/PRACHI/OneDrive/Desktop/ScamTraceAI/frontend/src/components/ui/Modal.tsx): Dialog with backdrop blur, focus trap, and Escape key dismissal.
- [`Table.tsx`](file:///C:/Users/PRACHI/OneDrive/Desktop/ScamTraceAI/frontend/src/components/ui/Table.tsx): High-density forensic data grid with fixed headers and subtle row highlights.
- [`Badge.tsx`](file:///C:/Users/PRACHI/OneDrive/Desktop/ScamTraceAI/frontend/src/components/ui/Badge.tsx): Monospace tags for algorithms, status flags, and cluster IDs.

---

## 5. View-by-View Implementation Summary

### 5.1 Homepage & Hero
- Interactive canvas background (`IntelligenceNetwork.tsx`) with proximity links, pulse packets, and cursor deflection.
- Refined sticky header with cyan active indicator and high-contrast site search trigger.
- Interactive pull-tape preloader (`PullMeHeroTape.tsx`) and real-time live indicator ticker (`MarqueeBanner.tsx`).
- Responsive mini live extractor demo demonstrating instant offline regex entity masking.

### 5.2 Command Center
- SOC operations dashboard featuring real-time telemetry stream.
- Recharts distribution bar chart with cyan and amber fill gradients.
- Model engine telemetry card tracking TF-IDF LR, 10-Feature RF, and local Ollama Gemma status.
- Direct case ingestion feed querying live SQLite database records.

### 5.3 New Investigation Workspace
- 3-column incident command center:
  - Column 1: Suspicious message / URL input with one-click forensic presets (KYC, Task Scam, Courier, Clean).
  - Column 2: Dual classifier telemetry cards (Text Classifier + Lexical URL Classifier with feature breakdown).
  - Column 3: Bi-directional highlighted evidence cards with interactive span hover synchronization.
- Local Gemma 4 Analytical Report card with honest offline fallback state.
- One-click case export (`JSON`, `Copy Markdown`, and `Print/PDF`).

### 5.4 Investigation Graph
- ReactFlow canvas with dark nodes, glowing cyan structural edges, and minimap.
- Interactive node inspection side panel displaying confidence, indicators, and timestamps.
- Explicit attribution disclaimer highlighting that graph edges represent statistical correlation, not legal identity.

### 5.5 Campaign Intelligence
- Coordinated threat cluster view powered by TF-IDF cosine similarity matrices.
- Adjustable similarity threshold slider with instant cluster filtering.
- Clamped and normalized similarity metrics (`99%`, `97%`, `91%`).

### 5.6 Model Laboratory & Metrics
- Offline held-out benchmark cards displaying genuine accuracy, F1, and precision scores.
- Feature attribution breakdown for 10-feature lexical URL model.
- Engineering integrity banner reaffirming strict zero-leakage training standards.

### 5.7 History & Case Archive
- Case record grid with real-time text and threat-level search filter.
- Permanent deletion modal with administrative passphrase protection.
- Direct deep-links to inspect individual stored investigations.

### 5.8 Scam Academy & Defense Field Manual
- Verified Emergency Victim Reporting Directory for India (1930 / cybercrime.gov.in / Chakshu), United States (FBI IC3 / FTC), and UK (Action Fraud).
- Spot-the-Scam interactive scored simulation quiz with forensic rationales.
- Searchable cybercrime terminology glossary with category filters.
- Accessible FAQ accordion with smooth disclosure animations.

### 5.9 System Settings & Telemetry
- Real-time backend API, local Ollama, and model artifact health indicators.
- Explicit Demo Mode toggle with browser local storage persistence.
- Admin passphrase field with password visibility toggle.
- Settings reset confirmation modal.

### 5.10 Global Overlays & Modals
- Command Palette (`Ctrl + K`) with real-time keyboard navigation (`↑`, `↓`, `Enter`, `Esc`).
- Keyboard Shortcuts Cheatsheet (`?`).
- Privacy & essential storage cookie banner.
- Incident report & feedback modal.

---

## 6. Accessibility & Contrast Verification (WCAG 2.1 AA)

Mathematical contrast ratios computed from the production tokens via [verify_phase6.py](file:///C:/Users/PRACHI/OneDrive/Desktop/ScamTraceAI/scripts/verify_phase6.py):

| Element Tested | Foreground | Background | Actual Contrast | WCAG Requirement | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Primary Cyan on Dark Navy | `#22D3EE` | `#080D18` | **10.75 : 1** | >= 3.0 : 1 | **PASS** |
| Dark Navy Text on Primary Cyan Button | `#080D18` | `#22D3EE` | **10.75 : 1** | >= 4.5 : 1 | **PASS** |
| Text Primary on Dark Surface | `#F1F5F9` | `#141F30` | **15.11 : 1** | >= 4.5 : 1 | **PASS** |
| Text Secondary on Dark Surface | `#94A3B8` | `#141F30` | **6.46 : 1** | >= 4.5 : 1 | **PASS** |
| Risk High on Dark Surface | `#F87171` | `#141F30` | **5.99 : 1** | >= 4.5 : 1 | **PASS** |
| Risk Warning on Dark Surface | `#FBBF24` | `#141F30` | **9.92 : 1** | >= 4.5 : 1 | **PASS** |
| Risk Low on Dark Surface | `#2DD4BF` | `#141F30` | **8.89 : 1** | >= 4.5 : 1 | **PASS** |
| Light Theme: Text Slate 900 on White | `#0F172A` | `#FFFFFF` | **17.85 : 1** | >= 4.5 : 1 | **PASS** |
| Light Theme: Text Slate 600 on White | `#475569` | `#FFFFFF` | **7.58 : 1** | >= 4.5 : 1 | **PASS** |
| Light Theme: Cyan Accent on Light Bg | `#0891B2` | `#F8FAFC` | **3.52 : 1** | >= 3.0 : 1 | **PASS** |

---

## 7. Verification Gates & Test Summary

| Gate | Command | Result | Details |
| :--- | :--- | :--- | :--- |
| **Backend Unit Tests** | `pytest backend/tests/ -v` | **13 / 13 PASSED** | All sanitization, entity masking, lexical URL, and Gemma fallback tests pass in 17.36s. |
| **Frontend Compilation** | `npm run build` (`tsc -b && vite build`) | **0 ERRORS** | Full TypeScript compilation and production bundle generated cleanly in < 1.0s. |
| **Contrast Audit** | `python scripts/verify_phase6.py` | **10 / 10 PASSED** | All core and derived light theme color pairs exceed WCAG 2.1 AA specifications. |
| **Visual Verification** | Edge Headless Multi-Viewport | **22 SCREENSHOTS** | Captured in `docs/redesign/phase3/`, `phase4/`, `phase5/`, `phase6/`. |

---

## 8. Preserved Features Checklist

- [x] Command Center (SOC Telemetry, Recharts graph, Recent investigations)
- [x] New Investigation Workspace (Bi-directional span highlights, dual ML classification, Gemma report)
- [x] Interactive Graph (ReactFlow canvas, node inspector, attribution disclaimer)
- [x] Campaign Intelligence (Cosine similarity clusters, threshold slider)
- [x] Model Laboratory (Held-out benchmark metrics, feature importance table)
- [x] Investigation History (Filter search, inspect link, deletion modal)
- [x] Scam Academy & Defense Field Manual (Field guides, verified emergency helplines)
- [x] Spot The Scam Simulation Quiz (Interactive scoring, forensic rationales)
- [x] Cybercrime Glossary & Filter Tabs
- [x] Accessible FAQ Accordion
- [x] Feedback & Incident Reporting Modal
- [x] Dark / Light Theme Toggle & Persistent Preference
- [x] Essential Storage Cookie Banner
- [x] Global Command Palette (`Ctrl + K`)
- [x] Keyboard Shortcuts Modal (`?`)
- [x] Back to Top Smooth Scroller
- [x] Mobile Navigation Drawer
- [x] Scroll Progress Indicator
- [x] One-Click Copy & Export Buttons
- [x] High-Precision Print Stylesheet (`@media print`)
- [x] Sticky Header with Brand Wordmark
- [x] Accessibility Skip Link (`#main-content`)
- [x] Password Visibility Toggle with `aria-pressed`
- [x] First-Party UTM Parameter Capture
- [x] Floating Quick Action Pill

---
*SCAMTRACE AI — Expose the evidence behind the scam.*
