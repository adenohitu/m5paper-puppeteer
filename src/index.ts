import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { validateScreenshotParams } from "./utils/validation";
import { screenshotService } from "./screenshot";

const app = new Hono();

// Serve static files from public directory
app.use(
  "/static/*",
  serveStatic({
    root: "./public",
    rewriteRequestPath: (path: string) => path.replace(/^\/static/, ""),
  })
);

// Serve frontend
app.get("/", serveStatic({ path: "./public/index.html" }));

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Screenshot API
app.get("/screenshot", async (c) => {
  try {
    const params = c.req.query();
    const validation = validateScreenshotParams(params);

    if (!validation.isValid) {
      return c.json({ error: validation.error }, 400);
    }

    const options = validation.data!;
    const screenshot = await screenshotService.takeScreenshot(options);

    const contentType = options.format === "jpeg" ? "image/jpeg" : "image/png";
    const filename = `screenshot_${Date.now()}.${options.format}`;

    c.header("Content-Type", contentType);
    c.header("Content-Disposition", `attachment; filename="${filename}"`);

    return c.body(screenshot);
  } catch (error) {
    console.error("Screenshot error:", error);
    return c.json(
      {
        error: "Failed to take screenshot",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

// API documentation
app.get("/api-docs", (c) => {
  return c.json({
    title: "Screenshot API Documentation",
    version: "1.0.0",
    endpoints: {
      "/screenshot": {
        method: "GET",
        description: "Take a screenshot of a webpage",
        parameters: {
          url: {
            type: "string",
            required: true,
            description: "URL of the webpage to screenshot",
          },
          width: {
            type: "number",
            required: false,
            default: 1200,
            description: "Screenshot width in pixels (1-4000)",
          },
          height: {
            type: "number",
            required: false,
            default: 800,
            description: "Screenshot height in pixels (1-4000)",
          },
          format: {
            type: "string",
            required: false,
            default: "png",
            enum: ["png", "jpeg"],
            description: "Image format",
          },
          quality: {
            type: "number",
            required: false,
            default: 90,
            description: "JPEG quality (1-100, only for jpeg format)",
          },
          fullPage: {
            type: "boolean",
            required: false,
            default: false,
            description: "Capture full page or just viewport",
          },
        },
      },
    },
  });
});

const port = process.env.PORT || 3000;

console.log(`Server is running on port ${port}`);
serve({
  fetch: app.fetch,
  port: Number(port),
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  await screenshotService.closeBrowser();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Received SIGINT, shutting down gracefully...");
  await screenshotService.closeBrowser();
  process.exit(0);
});
