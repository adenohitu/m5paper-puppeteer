import puppeteer, { Browser, Page } from "puppeteer";
import { ScreenshotOptions } from "./utils/validation";

export class ScreenshotService {
  private browser: Browser | null = null;

  async initBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
        ],
      });
    }
  }

  async takeScreenshot(options: ScreenshotOptions): Promise<Buffer> {
    await this.initBrowser();

    if (!this.browser) {
      throw new Error("Failed to initialize browser");
    }

    const page: Page = await this.browser.newPage();

    try {
      // Set viewport
      await page.setViewport({
        width: options.width || 1200,
        height: options.height || 800,
      });

      // Navigate to URL
      await page.goto(options.url, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      // Take screenshot
      const screenshotOptions: any = {
        type: options.format || "png",
        fullPage: options.fullPage || false,
      };

      if (options.format === "jpeg") {
        screenshotOptions.quality = options.quality || 90;
      }

      const screenshot = await page.screenshot(screenshotOptions);

      return screenshot as Buffer;
    } finally {
      await page.close();
    }
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const screenshotService = new ScreenshotService();
