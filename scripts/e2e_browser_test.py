import os
import sys
import time

def run_browser_e2e():
    print("=" * 60)
    print("ScamTrace AI: End-to-End Browser UI & Forensic Flow Test")
    print("=" * 60)

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("Playwright not installed, installing now...")
        return False

    screenshot_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "references")
    os.makedirs(screenshot_dir, exist_ok=True)
    screenshot_path = os.path.join(screenshot_dir, "investigation_e2e_screenshot.png")

    with sync_playwright() as p:
        browser = None
        # Try MS Edge or Chromium
        for channel in ["msedge", "chrome", None]:
            try:
                if channel:
                    browser = p.chromium.launch(channel=channel, headless=True)
                else:
                    browser = p.chromium.launch(headless=True)
                break
            except Exception as e:
                print(f"Channel {channel} launch failed: {e}")
                continue

        if not browser:
            print("Could not launch browser channel. Attempting installing chromium...")
            os.system(f"{sys.executable} -m playwright install chromium")
            browser = p.chromium.launch(headless=True)

        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("Navigating to http://localhost:5173/#/investigate ...")
        page.goto("http://localhost:5173/#/investigate", wait_until="networkidle")

        print("Page title:", page.title())
        assert "ScamTrace" in page.content() or "Evidence" in page.content(), "Expected page content not found"

        # Fill in the form
        test_msg = "URGENT: Your State Bank account 4921 has been suspended due to pending KYC verification. Update immediately at http://sbi-kyc-verify-portal.top/login or your funds will be frozen within 2 hours."
        test_url = "http://sbi-kyc-verify-portal.top/login"

        print("Filling textarea and link input...")
        page.fill("textarea", test_msg)
        page.fill("input[placeholder*='suspect-portal']", test_url)

        # Click submit
        print("Submitting investigation...")
        page.click("button:has-text('Expose Evidence')")

        # Wait for results container
        print("Waiting for forensic report container...")
        page.wait_for_selector(".investigation-report-container", timeout=15000)

        # Verify key results rendered in DOM
        content = page.content()
        assert "HIGH CONCERN" in content.upper() or "SUSPICIOUS" in content.upper(), "Risk level missing from DOM"
        assert "URGENCY" in content.upper(), "Urgency indicator missing from DOM"
        assert "SAFETY PLAYBOOK" in content.upper(), "Safety playbook missing from DOM"

        print("Forensic report elements confirmed in browser DOM!")
        time.sleep(1) # Let animations settle

        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Captured full-page forensic screenshot at: {screenshot_path}")

        browser.close()
        return True

if __name__ == "__main__":
    success = run_browser_e2e()
    if not success:
        sys.exit(1)
