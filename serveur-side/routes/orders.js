import { Router } from "express";
import { create, list, patchStatus } from "../controllers/orderController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/", create);
router.get("/", requireAuth, requireRole("admin"), list);
router.patch("/:id/status", requireAuth, requireRole("admin"), patchStatus);

export default router;
