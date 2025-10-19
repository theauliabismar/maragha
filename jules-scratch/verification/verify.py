import time
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    time.sleep(5)

    # Login
    page.goto("http://localhost:5173/login")
    page.get_by_label("Email").fill("admin@example.com")
    page.get_by_label("Password").fill("password")
    page.get_by_role("button", name="Log in").click()
    expect(page).to_have_url("http://localhost:5173/admin")

    # Navigate to book management
    page.goto("http://localhost:5173/admin/manage/books")
    expect(page.get_by_text("Manage Books")).to_be_visible()

    # Add a new book
    page.get_by_role("button", name="Add new").click()
    page.wait_for_selector('.bx--modal-container')
    page.get_by_label("Title").fill("Test Book")
    page.get_by_label("Edition").fill("1st Edition")
    page.locator('select[name="status"]').select_option("draft")
    page.locator('select[name="author"]').select_option(label="Test Author")
    page.locator('select[name="category"]').select_option(label="Test Category")
    page.locator('select[name="publisher"]').select_option(label="Test Publisher")
    page.get_by_role("button", name="Add").click()

    # Navigate to the new book's page management
    page.get_by_role("cell", name="Test Book").first.click()
    expect(page.get_by_text("Manage Pages for Test Book")).to_be_visible()

    # Add a new page
    page.get_by_role("button", name="Add new").click()
    page.wait_for_selector('.bx--modal-container')
    page.get_by_label("Original Text").fill("This is the original text.")
    page.get_by_label("Translation").fill("This is the translation.")
    page.locator('select[name="status"]').select_option("draft")
    page.get_by_role("button", name="Add").click()

    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
