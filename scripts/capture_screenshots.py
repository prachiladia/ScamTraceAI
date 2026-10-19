import subprocess
import os
import time

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
OUTPUT_DIR = r"C:\Users\PRACHI\OneDrive\Desktop\ScamTraceAI\docs\redesign\before"
BASE_URL = "http://localhost:5173"

ROUTES = [
    ("home", "#/"),
    ("command_center", "#/command-center"),
    ("investigate", "#/investigate"),
    ("graph", "#/graph"),
    ("campaigns", "#/campaigns"),
    ("model_lab", "#/model-lab"),
    ("history", "#/history"),
    ("academy", "#/academy"),
    ("about", "#/about"),
    ("settings", "#/settings")
]

BREAKPOINTS = [
    ("desktop_1440", 1440, 1000),
    ("desktop_1280", 1280, 900),
    ("tablet_768", 768, 1024),
    ("mobile_390", 390, 844)
]

os.makedirs(OUTPUT_DIR, exist_ok=True)

# For key pages take multiple breakpoints, for all pages take desktop_1440
for page_name, route in ROUTES:
    for bp_name, width, height in BREAKPOINTS:
        # To avoid taking 40 screenshots, take key breakpoints for hero/workspace/graph/academy, and 1440+390 for others
        if bp_name in ("desktop_1440", "mobile_390") or page_name in ("home", "investigate", "command_center"):
            out_file = os.path.join(OUTPUT_DIR, f"{page_name}_{bp_name}.png")
            url = f"{BASE_URL}/{route}"
            cmd = [
                EDGE_PATH,
                "--headless=new",
                f"--screenshot={out_file}",
                f"--window-size={width},{height}",
                r"--user-data-dir=C:\Users\PRACHI\AppData\Local\Temp\edge_audit",
                "--virtual-time-budget=2000",
                url
            ]
            try:
                subprocess.run(cmd, check=True, timeout=15)
                print(f"Captured: {page_name}_{bp_name}.png")
            except Exception as e:
                print(f"Failed {page_name}_{bp_name}: {e}")

print("Screenshot audit capture complete.")
