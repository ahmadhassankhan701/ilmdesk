import {
  canPassThrough,
  fittedSize,
  IMAGE_SOURCE_MAX_BYTES,
  receiptPdfMessage,
  RECEIPT_PDF_MAX_BYTES,
  uploadSpec,
} from "./mediaLimits.js";

export class UploadPrepError extends Error {
  constructor(message) {
    super(message);
    this.name = "UploadPrepError";
  }
}

let webpSupport;

function canvasBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

async function supportsWebp() {
  if (webpSupport !== undefined) return webpSupport;
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const blob = await canvasBlob(canvas, "image/webp", 0.8);
  webpSupport = blob?.type === "image/webp";
  return webpSupport;
}

function renamed(file, blob) {
  const extension = blob.type === "image/webp" ? "webp" : "jpg";
  const stem = (file.name || "image").replace(/\.[^.]+$/, "").replace(/[^\w.\- ]+/g, "").trim() || "image";
  return new File([blob], `${stem}.${extension}`, { type: blob.type, lastModified: Date.now() });
}

async function loadSource(file) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // Fall through to an Image element for formats the bitmap loader skips.
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new UploadPrepError("This image could not be read. Use a JPG, PNG, or WebP."));
      image.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function draw(source, width, height, opaque) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (opaque) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
  }
  context.drawImage(source, 0, 0, width, height);
  return canvas;
}

export async function prepareImage(file, kind) {
  const spec = uploadSpec(kind);
  if (!file?.type?.startsWith("image/")) throw new UploadPrepError("Choose an image file.");
  if (file.type === "image/gif") {
    if (file.size < spec.max) return file;
    throw new UploadPrepError("This GIF is too large. Use a JPG, PNG, or WebP.");
  }
  if (file.size > IMAGE_SOURCE_MAX_BYTES) {
    throw new UploadPrepError("This image is over 15MB. Resize it and try again.");
  }
  if (canPassThrough(file, kind)) return file;
  if (typeof document === "undefined") throw new UploadPrepError("This image could not be prepared.");

  const source = await loadSource(file);
  if (!source.width || !source.height) {
    source.close?.();
    throw new UploadPrepError("This image could not be read. Use a JPG, PNG, or WebP.");
  }
  const webp = await supportsWebp();
  const type = webp ? "image/webp" : "image/jpeg";
  let best = null;
  try {
    for (const step of spec.steps) {
      const size = fittedSize(source.width, source.height, step.edge);
      const canvas = draw(source, size.width, size.height, !webp);
      const blob = await canvasBlob(canvas, type, step.quality);
      canvas.width = 0;
      canvas.height = 0;
      if (!blob) continue;
      if (!best || blob.size < best.size) best = blob;
      if (blob.size <= spec.target) {
        if (file.size <= blob.size && file.size < spec.max) return file;
        return renamed(file, blob);
      }
    }
  } finally {
    source.close?.();
  }

  if (file.size < spec.max && (!best || file.size <= best.size)) return file;
  if (best && best.size < spec.max) return renamed(file, best);
  throw new UploadPrepError("This image is still too large after compression. Crop it and try again.");
}

export async function prepareReceipt(file) {
  if (!file) throw new UploadPrepError("Choose a receipt.");
  if (file.type === "application/pdf") {
    if (file.size >= RECEIPT_PDF_MAX_BYTES) throw new UploadPrepError(receiptPdfMessage());
    return file;
  }
  const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/avif"];
  if (!allowed.includes(file.type)) throw new UploadPrepError("Upload a PNG, JPG, WebP, or PDF.");
  return prepareImage(file, "receipt");
}
