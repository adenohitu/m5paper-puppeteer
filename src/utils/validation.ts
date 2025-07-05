import { URL } from "url";

export interface ScreenshotOptions {
  url: string;
  width?: number;
  height?: number;
  format?: "png" | "jpeg";
  quality?: number;
  fullPage?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: ScreenshotOptions;
}

export const validateScreenshotParams = (params: any): ValidationResult => {
  if (!params.url) {
    return {
      isValid: false,
      error: "URL parameter is required",
    };
  }

  // URL validation
  try {
    new URL(params.url);
  } catch {
    return {
      isValid: false,
      error: "Invalid URL format",
    };
  }

  const width = params.width ? parseInt(params.width) : 1200;
  const height = params.height ? parseInt(params.height) : 800;
  const format = params.format || "png";
  const quality = params.quality ? parseInt(params.quality) : 90;
  const fullPage = params.fullPage === "true";

  // Validate dimensions
  if (width <= 0 || width > 4000) {
    return {
      isValid: false,
      error: "Width must be between 1 and 4000 pixels",
    };
  }

  if (height <= 0 || height > 4000) {
    return {
      isValid: false,
      error: "Height must be between 1 and 4000 pixels",
    };
  }

  // Validate format
  if (!["png", "jpeg"].includes(format)) {
    return {
      isValid: false,
      error: "Format must be png or jpeg",
    };
  }

  // Validate quality
  if (quality < 1 || quality > 100) {
    return {
      isValid: false,
      error: "Quality must be between 1 and 100",
    };
  }

  return {
    isValid: true,
    data: {
      url: params.url,
      width,
      height,
      format: format as "png" | "jpeg",
      quality,
      fullPage,
    },
  };
};
