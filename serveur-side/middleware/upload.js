import multer from "multer";
import crypto from "crypto";
import path from "path";
import supabase from "../config/supabase.js";

const BUCKET = process.env.SUPABASE_BUCKET || "products";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

// Keep file in memory — Vercel filesystem is ephemeral, Supabase is the real store.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 300 * 1024 }, // 300 KB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) return cb(null, true);
    cb(new Error("Only image files are allowed (jpg, png, webp, gif, avif)"));
  },
});

/**
 * Upload a file buffer to Supabase Storage and return its public URL.
 * @param {Express.Multer.File} file  — req.file from multer
 * @returns {Promise<string>}          public URL
 */
export async function uploadToSupabase(file) {
  const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw new Error(`Supabase upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}
