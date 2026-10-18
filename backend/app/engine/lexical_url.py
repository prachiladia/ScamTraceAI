import re
import math
from collections import Counter
from urllib.parse import urlparse
from typing import Dict, Any

SUSPICIOUS_KEYWORDS = [
    "login", "signin", "verify", "verification", "secure", "security",
    "account", "banking", "update", "confirm", "wallet", "support",
    "service", "portal", "alert", "password", "recover", "authenticate"
]

HIGH_RISK_TLDS = {
    "top", "xyz", "tk", "ml", "ga", "cf", "gq", "work", "click", "link",
    "buzz", "rest", "cam", "fit", "icu", "date", "racing", "loan", "stream"
}

IPV4_PATTERN = re.compile(r"^(?:https?://)?(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?::[0-9]+)?(?:/.*)?$")

def calculate_shannon_entropy(s: str) -> float:
    """Calculates the Shannon entropy of a given string (in bits)."""
    if not s:
        return 0.0
    counts = Counter(s)
    total = len(s)
    return -sum((count / total) * math.log2(count / total) for count in counts.values())

def extract_lexical_features(url_string: str) -> Dict[str, Any]:
    """
    Extracts 100% offline, local lexical features from a URL string.
    Rule A.6: Strictly zero network/DNS/WHOIS/HTTP requests are performed.
    """
    clean_url = url_string.strip()
    lower_url = clean_url.lower()

    # Parse structure without resolving
    parsed = urlparse(clean_url if "://" in clean_url else f"http://{clean_url}")
    netloc = parsed.netloc.lower()
    path = parsed.path
    query = parsed.query

    # 1. URL Length
    url_length = len(clean_url)

    # 2. Number of Dots
    num_dots = clean_url.count(".")

    # 3. Has HTTPS
    has_https = 1 if clean_url.lower().startswith("https://") else 0

    # 4. Has IP in domain
    has_ip = 1 if IPV4_PATTERN.match(clean_url) or re.search(r"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b", netloc) else 0

    # 5. Number of Subdirectories
    path_segments = [p for p in path.split("/") if p]
    num_subdirs = len(path_segments)

    # 6. Number of Parameters
    num_params = clean_url.count("&") + clean_url.count("?")

    # 7. Suspicious Words Count
    suspicious_words = sum(1 for kw in SUSPICIOUS_KEYWORDS if kw in lower_url)

    # 8. Special Character Count
    special_chars = set("-@_%=+~#*&?")
    special_char_count = sum(1 for c in clean_url if c in special_chars)

    # 9. Digits Count
    digits_count = sum(1 for c in clean_url if c.isdigit())

    # 10. Shannon Entropy
    entropy = calculate_shannon_entropy(clean_url)

    # Extracted TLD
    tld = ""
    domain_parts = netloc.split(":")[0].split(".")
    if len(domain_parts) > 1:
        tld = domain_parts[-1]

    is_high_risk_tld = 1 if tld in HIGH_RISK_TLDS else 0

    return {
        "url_length": url_length,
        "num_dots": num_dots,
        "has_https": has_https,
        "has_ip": has_ip,
        "num_subdirs": num_subdirs,
        "num_params": num_params,
        "suspicious_words": suspicious_words,
        "special_char_count": special_char_count,
        "digits_count": digits_count,
        "entropy": round(entropy, 6),
        "tld": tld,
        "is_high_risk_tld": is_high_risk_tld,
    }
