import { Page } from '@playwright/test'

/**
 * Base Page Object
 * Contains common functionality shared across all pages
 */
export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to a specific URL
   */
  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path)
  }

  /**
   * Get the page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title()
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded')
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Clear localStorage
   */
  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear())
  }

  /**
   * Get item from localStorage
   */
  async getLocalStorageItem(key: string): Promise<string | null> {
    return await this.page.evaluate((key) => localStorage.getItem(key), key)
  }

  /**
   * Reload the page
   */
  async reload(): Promise<void> {
    await this.page.reload()
  }
}
