import { Router } from "express";
import { upload, uploadToSupabase } from "../middleware/upload.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  upload.single("file"),
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
