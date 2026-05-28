import { Router } from "express";
import { upload, uploadToSupabase } from "../middleware/upload.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Wrap multer so size/type errors return clean JSON instead of a generic 500.
const uploadSingle = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (!err) return next();
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ message: "Image must be 300 KB or smaller" });
    }
    return res.status(400).json({ message: err.message || "Upload failed" });
  });
};

router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  uploadSingle,
  async (req, res, next) => {
    try {
      if (!req.file) {
        const e = new Error("No file provided");
        e.status = 400;
        return next(e);
      }

      const url = await uploadToSupabase(req.file);
      res.status(201).json({ url });
    } catch (err) {
      err.status = 500;
      next(err);
    }
  }
);

export default router;
