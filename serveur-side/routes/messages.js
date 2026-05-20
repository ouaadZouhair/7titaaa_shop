import { Router } from "express";
import { create, list, patchRead, remove } from "../controllers/messageController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/", create);
router.get("/", requireAuth, requireRole("admin"), list);
router.patch("/:id/read", requireAuth, requireRole("admin"), patchRead);
router.delete("/:id", requireAuth, requireRole("admin"), remove);

export default router;
