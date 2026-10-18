import re
import hashlib
from typing import List
from backend.app.models.schemas import EntityItem

PHONE_PATTERN = re.compile(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}")
EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
UPI_PATTERN = re.compile(r"[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}")

def mask_phone(phone: str) -> str:
    cleaned = re.sub(r"[^\d+]", "", phone)
    if len(cleaned) <= 4:
        return "****"
    return f"{cleaned[:3]}***{cleaned[-2:]}"

def mask_email(email: str) -> str:
    parts = email.split("@")
    if len(parts) != 2:
        return "***@***"
    user, domain = parts
    if len(user) <= 2:
        masked_user = "*d"
    else:
        masked_user = f"{user[0]}***{user[-1]}"
    return f"{masked_user}@{domain}"

def mask_upi(upi: str) -> str:
    parts = upi.split("@")
    if len(parts) != 2:
        return "***@***"
    handle, bank = parts
    masked_handle = f"{handle[0]}***{handle[-1]}" if len(handle) > 2 else "**"
    return f"{masked_handle}@{bank}"

def mask_url(url: str) -> str:
    # Remove protocol
    u = re.sub(r"^https?://", "", url)
    parts = u.split("/")
    domain = parts[0]
    path = "/" + "/".join(parts[1:]) if len(parts) > 1 else ""
    
    domain_tokens = domain.split(".")
    if len(domain_tokens) >= 2:
        name = domain_tokens[0]
        ext = ".".join(domain_tokens[1:])
        masked_domain = f"{name[:3]}***.{ext}" if len(name) > 3 else f"{name}***.{ext}"
    else:
        masked_domain = domain[:3] + "***"

    return f"{masked_domain}{path[:15]}"

def generate_template_hash(text: str) -> str:
    # Normalize text: strip digits, punctuation, and extra whitespace
    cleaned = re.sub(r"\d+", "<NUM>", text.lower())
    cleaned = re.sub(r"[^\w\s<>]", "", cleaned)
    tokens = [w for w in cleaned.split() if w not in ["the", "a", "an", "is", "your", "to", "for"]]
    fingerprint_text = " ".join(tokens[:15])
    return hashlib.sha256(fingerprint_text.encode('utf-8')).hexdigest()[:10]

def extract_entities(text: str, url: str | None = None) -> List[EntityItem]:
    entities: List[EntityItem] = []
    seen = set()

    # 1. Phone Numbers
    for match in PHONE_PATTERN.finditer(text):
        raw = match.group(0)
        masked = mask_phone(raw)
        if masked not in seen:
            seen.add(masked)
            entities.append(EntityItem(
                id=f"ent-phone-{len(entities)+1}",
                type="phone",
                value=masked,
                display_type="Sender / Contact Number",
                context="Identified in message text body"
            ))

    # 2. Emails
    for match in EMAIL_PATTERN.finditer(text):
        raw = match.group(0)
        masked = mask_email(raw)
        if masked not in seen:
            seen.add(masked)
            entities.append(EntityItem(
                id=f"ent-email-{len(entities)+1}",
                type="email",
                value=masked,
                display_type="Electronic Mail Address",
                context="Referenced for recipient response or spoofed sender"
            ))

    # 3. UPI / Payment Handles
    for match in UPI_PATTERN.finditer(text):
        raw = match.group(0)
        # Avoid duplicating if already matched by email pattern
        if "@" in raw and not any(raw.endswith(ext) for ext in [".com", ".org", ".net", ".edu", ".in"]):
            masked = mask_upi(raw)
            if masked not in seen:
                seen.add(masked)
                entities.append(EntityItem(
                    id=f"ent-upi-{len(entities)+1}",
                    type="payment_id",
                    value=masked,
                    display_type="UPI / Virtual Payment Address",
                    context="Identified payment recipient handle"
                ))

    # 4. URL
    if url:
        masked_u = mask_url(url)
        if masked_u not in seen:
            seen.add(masked_u)
            entities.append(EntityItem(
                id=f"ent-url-{len(entities)+1}",
                type="url",
                value=masked_u,
                display_type="Target Landing Address",
                context="Deceptive landing link provided in submission"
            ))

    # 5. Template Fingerprint
    tmpl_hash = generate_template_hash(text)
    entities.append(EntityItem(
        id=f"ent-tmpl-{tmpl_hash}",
        type="template_hash",
        value=f"tmpl_{tmpl_hash}",
        display_type="Structural Template Fingerprint",
        context="Normalized structural token signature for campaign correlation"
    ))

    return entities
