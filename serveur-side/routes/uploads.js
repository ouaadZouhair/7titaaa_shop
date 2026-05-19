import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        err.status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
        return next(err);
      }
      if (!req.file) {
        const e = new Error("No file provided");
        e.status = 400;
        return next(e);
      }
      res.status(201).json({ url: `/uploads/${req.file.filename}` });
    });
  }
);

export default router;
