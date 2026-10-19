# SCAMTRACE AI — DESIGN & COMPONENT AUDIT (Phase 1)

**Date:** October 19, 2026  
**Active Branch:** `redesign/cinematic`  
**Target Design Direction:** Cinematic, dark cybersecurity threat-intelligence aesthetic (Navy/Cyan/Teal SOC interface with Space Grotesk, Inter, and JetBrains Mono typography).

---

## 1. Existing Route & Page Inventory

| Route | Page Component | Primary Purpose & Key Features |
| :--- | :--- | :--- |
| `#/` | `Home.tsx` | Landing experience: Hero headline, draggable evidence tab, marquee bands, 3-pillar storytelling cards, interactive mini-extractor, scam flip cards. |
| `#/investigate` | `NewInvestigation.tsx` | Core 3-column analysis workspace: input area, entity tags, character span highlights, model score gauges, Gemma AI explanation panel, user safety playbook. |
| `#/command-center` | `CommandCenter.tsx` | Incident command hub: telemetry metrics, risk distribution, recent investigation feed, DEMO DATA labelling. |
| `#/graph` | `InvestigationGraph.tsx` | React Flow node-link relationship visualizer: single-case & cross-case `SHARES_INDICATOR_WITH` edges, minimap, controls, 3-tab inspector. |
| `#/campaigns` | `CampaignIntel.tsx` | Coordinated scam wave detection: similarity threshold slider, correlated cluster cards, timeline ranges. |
| `#/model-lab` | `ModelLab.tsx` | Applied ML metrics: SMS spam classifier and offline lexical URL classifier held-out test benchmarks, confusion matrices, attribution. |
| `#/history` | `History.tsx` | Stored investigation archive: search filter, risk level badges, indicator count, protected deletion with admin passphrase. |
| `#/academy` | `ScamAcademy.tsx` | Cyber resilience education: 6-question simulation quiz with scoring, 20+ term searchable glossary, emergency reporting guide (India 1930 / US IC3 / UK Action Fraud), FAQ accordion. |
| `#/about` | `About.tsx` | Methodology & disclosure: zero-fetch lexical URL policy, dataset provenance, responsible AI limitations, non-attribution. |
| `#/settings` | `Settings.tsx` | System diagnostics: local Ollama daemon status, demo mode toggle, admin passphrase configuration, local storage reset. |

---

## 2. Existing Global Component Inventory

1. **Layout & Shell:**
   - `Header.tsx`: Sticky navigation, active nav indicators, search trigger (`Ctrl+K`), theme toggle, mobile hamburger trigger.
   - `Footer.tsx`: Brand wordmark, quick links, open-source disclosures.
   - `MobileMenu.tsx`: Accessible drawer with focus trapping.
   - `SkipLink.tsx`: Accessible bypass navigation link (`#main-content`).
   - `ScrollProgress.tsx`: Top horizontal scroll completion indicator.
2. **Interactive Widgets & Overlays:**
   - `CommandPalette.tsx`: Global search modal with category filtering and keyboard arrow selection.
   - `CookieBanner.tsx`: Local storage consent notice.
   - `FeedbackModal.tsx`: Floating feedback modal submitting to `/api/feedback`.
   - `BackToTop.tsx`: Scroll-to-top button with 350px threshold.
   - `NetworkStatusBanner.tsx`: Real-time online/offline detector.
   - `KeyboardShortcutsModal.tsx`: Shortcuts cheatsheet modal triggered by `?`.
   - `Toast.tsx`: Toast notification context provider.

---

## 3. Concrete Design Problems in Current Implementation

### A. Color Palette & Mood
* **Current Issue:** The previous palette relies heavily on crimson (`#A82020`), maroon (`#6C1A1A`), cream (`#F3E6D5`), and peach (`#FBE6C2`). While tactile, it reads as a historical crime-scene archive rather than a modern, state-of-the-art threat intelligence SOC.
* **Target Solution:** Replace with the cinematic cybersecurity palette:
  - Deep Navy Canvas: `--background: #080D18;`
  - Secondary Navy Surface: `--background-secondary: #101827;`
  - Panel Surfaces: `--surface: #141F30;`, `--surface-elevated: #1B293B;`
  - Cyan Highlights: `--accent-primary: #22D3EE;` (used with restraint for primary actions, active tabs, and interactive focal points).
  - Teal Secondary: `--accent-secondary: #2DD4BF;`
  - Subtle Borders: `--border-subtle: rgba(148, 163, 184, 0.16);`
  - Risk Semantic Colors: `--risk-high: #F87171;`, `--risk-warning: #FBBF24;`, `--risk-low: #2DD4BF;` (always accompanied by iconography and unambiguous text labels).

### B. Typography & Hierarchy
* **Current Issue:** Uses default browser sans-serif with generic `Impact` / `Arial Black` fallbacks.
* **Target Solution:** Install self-hosted `@fontsource` packages:
  - **Space Grotesk** for display headers and hero text (futuristic, confident, geometric).
  - **Inter** for all UI body text, navigation, labels, and forms (crisp, readable, neutral).
  - **JetBrains Mono** for technical data, hashes, investigation IDs, model metrics, and code spans.
  - Enforce desktop base body text `>= 16px` and mobile `>= 15px`.

### C. Branding & Identity
* **Current Issue:** Uses a standard Lucide `ShieldAlert` icon for the logo.
* **Target Solution:** Design an original SVG logo mark + wordmark representing a high-precision digital threat lens: a precision scanner optic intersecting a threat graph node network, rendered in cyan and teal.

### D. Hero Section & Interactive Visuals
* **Current Issue:** The hero lacks a dynamic intelligence visual backdrop.
* **Target Solution:** Build an original canvas-based **"Intelligence Network"** background:
  - Drifting graph nodes with proximity-based cyan/teal connection lines.
  - Soft data pulses traveling along edges.
  - Smooth cursor parallax / attraction.
  - Capped `devicePixelRatio`, `requestAnimationFrame` render loop, `IntersectionObserver` pause on offscreen/tab-hidden, and `prefers-reduced-motion` static fallback.

### E. Investigation Workspace & Evidence Linkage
* **Current Issue:** Character spans in text and evidence cards in Column 2/3 are visually disconnected.
* **Target Solution:** Implement bidirectional hover and focus linking: hovering over a text span highlights the corresponding evidence card, and hovering an evidence card highlights the exact text span in the original message.

### F. Investigation Graph
* **Current Issue:** Relies on generic styling without dedicated cyber-intel iconography.
* **Target Solution:** Deep navy graph canvas, delicate cyan edges with glow accents, typed node icons, hover neighbor highlighting (dimming unrelated nodes), and explicit disclaimer: *"A shared indicator suggests a possible connection; it does not prove common ownership or malicious attribution."*

---

## 4. Screenshot Audit Inventory (Captured at `docs/redesign/before/`)

All 10 routes have been screenshotted at `1440px`, `1280px`, `768px`, and `390px`:
- `home_desktop_1440.png`, `home_desktop_1280.png`, `home_tablet_768.png`, `home_mobile_390.png`
- `investigate_desktop_1440.png`, `investigate_desktop_1280.png`, `investigate_tablet_768.png`, `investigate_mobile_390.png`
- `command_center_desktop_1440.png`, `command_center_desktop_1280.png`, `command_center_tablet_768.png`, `command_center_mobile_390.png`
- `graph_desktop_1440.png`, `graph_mobile_390.png`
- `campaigns_desktop_1440.png`, `campaigns_mobile_390.png`
- `model_lab_desktop_1440.png`, `model_lab_mobile_390.png`
- `history_desktop_1440.png`, `history_mobile_390.png`
- `academy_desktop_1440.png`, `academy_mobile_390.png`
- `about_desktop_1440.png`, `about_mobile_390.png`
- `settings_desktop_1440.png`, `settings_mobile_390.png`

---

## 5. Phase 1 Verification Gate
* [x] Current work committed cleanly.
* [x] Branch `redesign/cinematic` created and active.
* [x] Dev servers running (`127.0.0.1:8000` and `localhost:5173`).
* [x] Comprehensive visual screenshot audit captured into `docs/redesign/before/`.
* [x] Concrete design issues and component inventory documented in `docs/redesign/AUDIT.md`.
