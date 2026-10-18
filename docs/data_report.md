# ScamTrace AI — Comprehensive Forensic Data Profiling Report

> Generated automatically by `scripts/inspect_data.py` to audit dataset provenance, distribution, feature feasibility, and data leakage safeguards.

---

## 1. Phishing Features Dataset (`phishing_features.csv`)

- **File Location:** `C:\Users\PRACHI\OneDrive\Desktop\ScamTraceAI\data\raw\phishing_features.csv`
- **File Size:** 16,118,654 bytes (15.37 MB)
- **SHA-256 Hash:** `1de48e23501c544b6d345fcdeca544c42f71ab10d3061e174b1d97feafc07db8`
- **Total Rows:** 160,064
- **Total Columns:** 13
- **Raw URL Column Present:** `url` (object)
- **Target Label Column:** `label` (values: [1, 0])
- **Missing Values:** {'url': 0, 'label': 0, 'url_length': 0, 'num_dots': 0, 'has_https': 0, 'has_ip': 0, 'num_subdirs': 0, 'num_params': 0, 'suspicious_words': 0, 'tld': 821, 'special_char_count': 0, 'digits_count': 0, 'entropy': 0}
- **Exact Duplicates (full row):** 0
- **Duplicate URLs:** 0

### Class Distribution:
| Label | Meaning | Count | Percentage |
|---|---|---|---|
| 1 | Phishing / Malicious | 159,244 | 99.49% |
| 0 | Legitimate / Benign | 820 | 0.51% |

### Column Inventory & Offline Computability Audit:
| Column | Dtype | Category | Local Offline Computable? | Status / Note |
|---|---|---|---|---|
| `url` | `object` | Raw Input | N/A | Raw URL string used for feature extraction |
| `label` | `int64` | Target | N/A | Binary classification target |
| `url_length` | `int64` | Extracted Feature | Yes (Pure Lexical) | Can be computed directly from URL string without network/DNS |
| `num_dots` | `int64` | Extracted Feature | Yes (Pure Lexical) | Can be computed directly from URL string without network/DNS |
| `has_https` | `int64` | Extracted Feature | Yes (Pure Lexical) | Can be computed directly from URL string without network/DNS |
| `has_ip` | `int64` | Extracted Feature | Yes (Pure Lexical) | Can be computed directly from URL string without network/DNS |
| `num_subdirs` | `int64` | Extracted Feature | Yes (Pure Lexical) | Can be computed directly from URL string without network/DNS |
| `num_params` | `int64` | Extracted Feature | Yes (Pure Lexical) | Can be computed directly from URL string without network/DNS |
| `suspicious_words` | `int64` | Extracted Feature | Yes (Pure Lexical) | Can be computed directly from URL string without network/DNS |
| `tld` | `object` | Extracted Feature | Yes (Pure Lexical) | Can be computed directly from URL string without network/DNS |
| `special_char_count` | `int64` | Extracted Feature | Yes (Pure Lexical) | Can be computed directly from URL string without network/DNS |
| `digits_count` | `int64` | Extracted Feature | Yes (Pure Lexical) | Can be computed directly from URL string without network/DNS |
| `entropy` | `float64` | Extracted Feature | Yes (Pure Lexical) | Can be computed directly from URL string without network/DNS |

### Security & Offline Execution Guarantee (Rule A.6):
All numeric and structural features (`url_length`, `num_dots`, `has_https`, `has_ip`, `num_subdirs`, `num_params`, `suspicious_words`, `special_char_count`, `digits_count`, `entropy`) are purely lexical. The inference engine **never makes network, DNS, WHOIS, or HTTP requests** to evaluate URLs. The `tld` column is parsed directly from the domain segment.

---

## 2. SMS Spam Collection Dataset (`spam.csv`)

- **File Location:** `C:\Users\PRACHI\OneDrive\Desktop\ScamTraceAI\data\raw\spam.csv`
- **File Size:** 486,376 bytes (474.98 KB)
- **SHA-256 Hash:** `d368d659ea5fa1c2cbf9f6be756622b4329ef8c3bf105572c03eb0741f908701`
- **Total Rows:** 5,572
- **Columns:** ['label', 'text']
- **Missing Values:** {'label': 0, 'text': 0}
- **Exact Duplicates (Message text):** 403

### Class Distribution:
| Label | Meaning | Count | Percentage |
|---|---|---|---|
| `ham` | Legitimate communication (Ham) | 4,825 | 86.59% |
| `spam` | Unsolicited / Spam lure | 747 | 13.41% |

### Data Leakage Safeguards (Rule A.4):
To prevent split leakage, duplicate messages are deduplicated prior to training/test split. Stratified train/val/test splits (70/15/15) are strictly maintained. TF-IDF vectorizer parameters and vocabulary are fit ONLY on the training split, never on validation or held-out test data.
