import { Router } from "express";
import { pool } from "../config/db.js";
import authRouter from "./auth.js";
import productsRouter from "./products.js";
import uploadsRouter from "./uploads.js";
import ordersRouter from "./orders.js";
import messagesRouter from "./messages.js";

const router = Router();

router.get("/health", async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ status: "ok", db: rows[0].ok === 1 });
  } catch (err) {
    next(err);
  }
});

router.use("/auth", authRouter);
router.use("/products", productsRouter);
router.use("/uploads", uploadsRouter);
router.use("/orders", ordersRouter);
router.use("/messages", messagesRouter);

export default router;
