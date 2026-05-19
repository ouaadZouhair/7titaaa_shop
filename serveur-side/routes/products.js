import { Router } from "express";
import { list, getOne, create, update, remove, stats } from "../controllers/productController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", list);
router.get("/stats", requireAuth, requireRole("admin"), stats);
router.get("/:id", getOne);

router.post("/", requireAuth, requireRole("admin"), create);
router.put("/:id", requireAuth, requireRole("admin"), update);
router.delete("/:id", requireAuth, requireRole("admin"), remove);

export default router;
