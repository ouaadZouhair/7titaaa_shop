import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * NOTE: Vercel's serverless filesystem is read-only except for /tmp, which is
 * ephemeral (wiped between invocations). So disk uploads do NOT persist in
 * production — this keeps the route from crashing on cold start, but to
 * actually store images, switch to Supabase Storage (see DEPLOYMENT.md).
 */
export const UPLOADS_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), "uploads")
  : path.join(__dirname, "..", "uploads");

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch {
  // Read-only FS — ignore; uploads simply won't persist here.
}

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const id = crypto.randomBytes(8).toString("hex");
    cb(null, `${Date.now()}-${id}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed (jpg, png, webp, gif, avif)"));
  },
});
