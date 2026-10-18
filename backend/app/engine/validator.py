import re
import html
from typing import Tuple

MAX_TEXT_LEN = 15000
MIN_TEXT_LEN = 3
MAX_URL_LEN = 2048

def sanitize_and_validate_input(text: str, url: str | None = None) -> Tuple[str, str | None, str | None]:
    """
    Sanitizes untrusted input, strips dangerous HTML tags / script injection (Rule A.7),
    and validates size constraints.
    Returns (clean_text, clean_url, error_message).
    """
    if not text or not isinstance(text, str):
        return "", None, "Message text cannot be empty."

    # Strip excessive leading/trailing whitespace
    stripped_text = text.strip()
    if len(stripped_text) < MIN_TEXT_LEN:
        return "", None, f"Input is too brief for forensic analysis (minimum {MIN_TEXT_LEN} characters)."

    if len(stripped_text) > MAX_TEXT_LEN:
        return "", None, f"Input exceeds maximum allowed size of {MAX_TEXT_LEN} characters."

    # HTML escaping to neutralize XSS
    sanitized_text = html.escape(stripped_text)

    # Sanitize URL if provided
    sanitized_url = None
    if url and isinstance(url, str):
        stripped_url = url.strip()
        if len(stripped_url) > MAX_URL_LEN:
            return "", None, f"URL exceeds maximum allowed length of {MAX_URL_LEN} characters."
        
        # Disallow dangerous javascript: or data: URIs
        lower_url = stripped_url.lower()
        if lower_url.startswith("javascript:") or lower_url.startswith("data:") or lower_url.startswith("vbscript:"):
            return "", None, "Disallowed URI scheme detected. Only HTTP/HTTPS or plain domains are accepted."

        sanitized_url = html.escape(stripped_url)

    return sanitized_text, sanitized_url, None
