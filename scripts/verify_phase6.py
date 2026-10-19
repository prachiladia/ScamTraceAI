import os
import subprocess
import json
import math

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
OUTPUT_DIR = r"C:\Users\PRACHI\OneDrive\Desktop\ScamTraceAI\docs\redesign\phase6"
BASE_URL = "http://localhost:5173"

os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1. WCAG 2.1 Contrast Calculation
def srgb_to_linear(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def luminance(hex_color):
    hex_color = hex_color.lstrip('#')
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)
    return 0.2126 * srgb_to_linear(r) + 0.7152 * srgb_to_linear(g) + 0.0722 * srgb_to_linear(b)

def contrast_ratio(hex1, hex2):
    l1 = luminance(hex1)
    l2 = luminance(hex2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

CONTRAST_PAIRS = [
    ("Primary Cyan on Dark Navy Background", "#22D3EE", "#080D18", "Large UI / Highlights", 3.0),
    ("Dark Navy Text on Primary Cyan Button", "#080D18", "#22D3EE", "Normal Text (Buttons)", 4.5),
    ("Text Primary (Slate 100) on Surface (#141F30)", "#F1F5F9", "#141F30", "Normal Text", 4.5),
    ("Text Secondary (Slate 400) on Surface (#141F30)", "#94A3B8", "#141F30", "Supporting Text", 4.5),
    ("Risk High (#F87171) on Surface (#141F30)", "#F87171", "#141F30", "Badge Label / Icon", 4.5),
    ("Risk Warning (#FBBF24) on Surface (#141F30)", "#FBBF24", "#141F30", "Badge Label / Icon", 4.5),
    ("Risk Low (#2DD4BF) on Surface (#141F30)", "#2DD4BF", "#141F30", "Badge Label / Icon", 4.5),
    ("Light Theme: Text Slate 900 on White Surface", "#0F172A", "#FFFFFF", "Normal Text", 4.5),
    ("Light Theme: Text Slate 600 on White Surface", "#475569", "#FFFFFF", "Supporting Text", 4.5),
    ("Light Theme: Cyan Accent (#0891B2) on Light Bg (#F8FAFC)", "#0891B2", "#F8FAFC", "Large UI / Focus", 3.0),
]

print("=== WCAG 2.1 AA CONTRAST RATIO AUDIT ===")
audit_results = []
for name, fg, bg, context, min_req in CONTRAST_PAIRS:
    ratio = contrast_ratio(fg, bg)
    passed = ratio >= min_req
    status = "PASS" if passed else "FAIL"
    print(f"[{status}] {name}: {ratio:.2f}:1 (Req: >={min_req}:1) [{fg} on {bg}]")
    audit_results.append({
        "name": name,
        "fg": fg,
        "bg": bg,
        "context": context,
        "ratio": round(ratio, 2),
        "min_required": min_req,
        "passed": passed
    })

with open(os.path.join(OUTPUT_DIR, "contrast_audit.json"), "w") as f:
    json.dump(audit_results, f, indent=2)

# 2. Capture Multi-Breakpoint Screenshots
SCREENSHOT_TARGETS = [
    # Breakpoints
    ("home_390.png", "?nopreloader=1#/", 390, 844, "dark"),
    ("home_768.png", "?nopreloader=1#/", 768, 1024, "dark"),
    ("home_1280.png", "?nopreloader=1#/", 1280, 800, "dark"),
    ("home_1440.png", "?nopreloader=1#/", 1440, 900, "dark"),

    ("investigate_390.png", "?nopreloader=1#/investigate", 390, 844, "dark"),
    ("investigate_1440.png", "?nopreloader=1#/investigate", 1440, 900, "dark"),

    ("command_center_390.png", "?nopreloader=1#/command-center", 390, 844, "dark"),
    ("command_center_1440.png", "?nopreloader=1#/command-center", 1440, 900, "dark"),

    # Light Theme Captures
    ("home_light_1440.png", "?theme=light&nopreloader=1#/", 1440, 900, "light"),
    ("investigate_light_1440.png", "?theme=light&nopreloader=1#/investigate", 1440, 900, "light"),
    ("command_center_light_1440.png", "?theme=light&nopreloader=1#/command-center", 1440, 900, "light"),
]

for filename, route, width, height, theme in SCREENSHOT_TARGETS:
    out_file = os.path.join(OUTPUT_DIR, filename)
    url = f"{BASE_URL}/{route}"
    user_data = f"C:\\Users\\PRACHI\\AppData\Local\\Temp\\edge_phase6_{theme}_{width}"
    
    cmd = [
        EDGE_PATH,
        "--headless=new",
        "--no-first-run",
        "--no-default-browser-check",
        f"--screenshot={out_file}",
        f"--window-size={width},{height}",
        f"--user-data-dir={user_data}",
        "--virtual-time-budget=2500",
    ]
    if theme == "light":
        cmd.append("--blink-settings=forceDarkModeEnabled=false")
    else:
        cmd.append("--blink-settings=forceDarkModeEnabled=true")

    cmd.append(url)
    try:
        subprocess.run(cmd, check=True, timeout=15)
        print(f"Captured: {filename} ({width}x{height}, theme: {theme})")
    except Exception as e:
        print(f"Failed {filename}: {e}")

print("Phase 6 Verification complete.")
