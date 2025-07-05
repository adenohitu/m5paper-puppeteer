class ScreenshotApp {
  constructor() {
    this.form = document.getElementById("screenshotForm");
    this.apiUrlInput = document.getElementById("apiUrl");
    this.resultSection = document.getElementById("resultSection");
    this.previewImage = document.getElementById("previewImage");
    this.captureBtn = document.getElementById("captureBtn");
    this.copyBtn = document.getElementById("copyBtn");
    this.downloadBtn = document.getElementById("downloadBtn");
    this.newCaptureBtn = document.getElementById("newCaptureBtn");
    this.qualityInput = document.getElementById("quality");
    this.formatSelect = document.getElementById("format");

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateApiUrl();
    this.toggleQualityInput();
  }

  bindEvents() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.form.addEventListener("input", () => this.updateApiUrl());
    this.copyBtn.addEventListener("click", () => this.copyApiUrl());
    this.downloadBtn.addEventListener("click", () => this.downloadImage());
    this.newCaptureBtn.addEventListener("click", () => this.resetForm());
    this.formatSelect.addEventListener("change", () =>
      this.toggleQualityInput()
    );
  }

  toggleQualityInput() {
    const isJpeg = this.formatSelect.value === "jpeg";
    this.qualityInput.disabled = !isJpeg;
    this.qualityInput.parentElement.style.opacity = isJpeg ? "1" : "0.5";
  }

  updateApiUrl() {
    const formData = new FormData(this.form);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      if (value && value !== "") {
        if (key === "fullPage") {
          params.append(key, "true");
        } else {
          params.append(key, value);
        }
      }
    }

    const baseUrl = `${window.location.origin}/screenshot`;
    const fullUrl = params.toString()
      ? `${baseUrl}?${params.toString()}`
      : baseUrl;
    this.apiUrlInput.value = fullUrl;
  }

  async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.form);
    const url = formData.get("url");

    if (!url) {
      this.showAlert("URLを入力してください", "error");
      return;
    }

    this.setLoading(true);

    try {
      const params = new URLSearchParams();
      for (const [key, value] of formData.entries()) {
        if (value && value !== "") {
          if (key === "fullPage") {
            params.append(key, "true");
          } else {
            params.append(key, value);
          }
        }
      }

      const response = await fetch(`/screenshot?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "スクリーンショットの撮影に失敗しました"
        );
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      this.showResult(imageUrl, blob);
      this.showAlert("スクリーンショットを撮影しました！", "success");
    } catch (error) {
      console.error("Error:", error);
      this.showAlert(error.message || "エラーが発生しました", "error");
    } finally {
      this.setLoading(false);
    }
  }

  showResult(imageUrl, blob) {
    this.previewImage.src = imageUrl;
    this.previewImage.onload = () => {
      this.resultSection.style.display = "block";
      this.resultSection.scrollIntoView({ behavior: "smooth" });
    };

    // Store blob for download
    this.currentBlob = blob;
  }

  setLoading(isLoading) {
    this.captureBtn.disabled = isLoading;
    this.captureBtn.classList.toggle("loading", isLoading);

    if (isLoading) {
      this.removeAlerts();
    }
  }

  async copyApiUrl() {
    try {
      await navigator.clipboard.writeText(this.apiUrlInput.value);
      this.showAlert("APIのURLをクリップボードにコピーしました", "success");
    } catch (error) {
      console.error("Copy failed:", error);
      this.showAlert("コピーに失敗しました", "error");
    }
  }

  downloadImage() {
    if (!this.currentBlob) return;

    const formData = new FormData(this.form);
    const format = formData.get("format") || "png";
    const url = formData.get("url");

    // Create filename from URL
    let filename = "screenshot";
    if (url) {
      try {
        const urlObj = new URL(url);
        filename = urlObj.hostname.replace(/[^a-z0-9]/gi, "_");
      } catch (e) {
        // Use default filename if URL parsing fails
      }
    }

    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[T:]/g, "_");
    const fullFilename = `${filename}_${timestamp}.${format}`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(this.currentBlob);
    link.download = fullFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showAlert("画像をダウンロードしました", "success");
  }

  resetForm() {
    this.resultSection.style.display = "none";
    this.currentBlob = null;
    this.removeAlerts();

    // Reset form to default values
    this.form.reset();
    document.getElementById("width").value = "1200";
    document.getElementById("height").value = "800";
    document.getElementById("quality").value = "90";
    document.getElementById("format").value = "png";

    this.updateApiUrl();
    this.toggleQualityInput();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  showAlert(message, type) {
    this.removeAlerts();

    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    // Insert after header
    const header = document.querySelector(".header");
    header.insertAdjacentElement("afterend", alert);

    // Auto remove after 5 seconds
    setTimeout(() => this.removeAlerts(), 5000);
  }

  removeAlerts() {
    const alerts = document.querySelectorAll(".alert");
    alerts.forEach((alert) => alert.remove());
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ScreenshotApp();
});

// Add some utility functions
window.addEventListener("beforeunload", () => {
  // Clean up blob URLs
  const images = document.querySelectorAll('img[src^="blob:"]');
  images.forEach((img) => {
    URL.revokeObjectURL(img.src);
  });
});

// Add keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + Enter to submit form
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    const form = document.getElementById("screenshotForm");
    if (form) {
      form.dispatchEvent(new Event("submit"));
    }
  }

  // Escape to close result
  if (e.key === "Escape") {
    const resultSection = document.getElementById("resultSection");
    if (resultSection && resultSection.style.display !== "none") {
      resultSection.style.display = "none";
    }
  }
});

// Add service worker for offline functionality (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Service worker registration would go here
    console.log("Service worker support detected");
  });
}

// Add error handling for global errors
window.addEventListener("error", (e) => {
  console.error("Global error:", e.error);
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason);
});
