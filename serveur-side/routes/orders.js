import { Router } from "express";
import { create, list, getOne, patchStatus } from "../controllers/orderController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/", create);
router.get("/", requireAuth, requireRole("admin"), list);
router.get("/:id", requireAuth, requireRole("admin"), getOne);
router.patch("/:id/status", requireAuth, requireRole("admin"), patchStatus);

export default router;
