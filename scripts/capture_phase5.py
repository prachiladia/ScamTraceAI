import subprocess
import os
import time

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
OUTPUT_DIR = r"C:\Users\PRACHI\OneDrive\Desktop\ScamTraceAI\docs\redesign\phase5"
BASE_URL = "http://localhost:5173"

os.makedirs(OUTPUT_DIR, exist_ok=True)

TARGETS = [
    ("graph_1440.png", "#/graph?nopreloader=1", 1440, 900),
    ("campaigns_1440.png", "#/campaigns?nopreloader=1", 1440, 900),
    ("model_lab_1440.png", "#/model-lab?nopreloader=1", 1440, 900),
    ("history_1440.png", "#/history?nopreloader=1", 1440, 900),
    ("academy_1440.png", "#/academy?nopreloader=1", 1440, 1000),
    ("about_1440.png", "#/about?nopreloader=1", 1440, 900),
    ("settings_1440.png", "#/settings?nopreloader=1", 1440, 900),
    ("not_found_1440.png", "#/not-found-indicator?nopreloader=1", 1440, 800),
]

for out_name, route, width, height in TARGETS:
    out_file = os.path.join(OUTPUT_DIR, out_name)
    url = f"{BASE_URL}/{route}"
    cmd = [
        EDGE_PATH,
        "--headless=new",
        "--no-first-run",
        "--no-default-browser-check",
        f"--screenshot={out_file}",
        f"--window-size={width},{height}",
        r"--user-data-dir=C:\Users\PRACHI\AppData\Local\Temp\edge_phase5",
        "--virtual-time-budget=2500",
        url
    ]
    try:
        subprocess.run(cmd, check=True, timeout=15)
        print(f"Captured: {out_name}")
    except Exception as e:
        print(f"Failed {out_name}: {e}")

print("Phase 5 screenshot capture complete.")
