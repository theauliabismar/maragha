import time
from playwright.sync_api import sync_playwright

from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Log in as a user with no permissions
    time.sleep(15)
    try:
        page.goto("http://127.0.0.1:5173/login")
    except Exception as e:
        print(f"Failed to connect to the server: {e}")
        browser.close()
        return
    expect(page).to_have_url("http://127.0.0.1:5173/login")
    page.get_by_label("Email").fill("test@example.com")
    page.get_by_label("Password").fill("password")
    page.get_by_role("button", name="Log in").click()
    expect(page).to_have_url("http://localhost:5173/admin/manage/authors")

    # Verify that the buttons are disabled
    add_button = page.get_by_role("button", name="Add new")
    edit_button = page.get_by_role("button", name="Edit").first()
    delete_button = page.get_by_role("button", name="Delete").first()

    expect(add_button).to_be_disabled()
    expect(edit_button).to_be_disabled()
    expect(delete_button).to_be_disabled()

    page.screenshot(path="jules-scratch/verification/rbac_verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
