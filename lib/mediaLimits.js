export const IMAGE_SOURCE_MAX_BYTES = 15 * 1024 * 1024;
export const PDF_MAX_BYTES = 5 * 1024 * 1024;
export const RECEIPT_PDF_MAX_BYTES = 2 * 1024 * 1024;

const PASS_THROUGH = new Set(["image/jpeg", "image/jpg", "image/webp", "image/avif"]);

const KINDS = {
  lesson: { target: 300 * 1024, max: 800 * 1024, edge: 1600 },
  cover: { target: 200 * 1024, max: 500 * 1024, edge: 1600 },
  receipt: { target: 500 * 1024, max: 2 * 1024 * 1024, edge: 1600 },
  profile: { target: 120 * 1024, max: 400 * 1024, edge: 800 },
};

export function uploadSpec(kind) {
  const spec = KINDS[kind];
  if (!spec) throw new Error("Unknown upload.");
  return { ...spec, steps: encodeSteps(spec.edge) };
}

export function encodeSteps(edge) {
  const edges = [edge, Math.round(edge * 0.75), Math.round(edge * 0.625)];
  const unique = edges.filter((value, index) => edges.indexOf(value) === index);
  const qualities = [0.75, 0.65, 0.55];
  return unique.flatMap((value) => qualities.map((quality) => ({ edge: value, quality })));
}

export function fittedSize(width, height, edge) {
  const longest = Math.max(width || 0, height || 0);
  if (!longest || longest <= edge) {
    return { width: Math.max(1, width || 1), height: Math.max(1, height || 1) };
  }
  const scale = edge / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function canPassThrough(file, kind) {
  const spec = uploadSpec(kind);
  return PASS_THROUGH.has(file?.type) && file.size <= spec.target;
}

export function pdfLimitMessage() {
  return "Each PDF must be under 5MB. Export it as text, or scan at 150 dpi.";
}

export function receiptPdfMessage() {
  return "The receipt PDF must be under 2MB.";
}
