import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";

import { pool, ensureDatabase } from "./config/db.js";
import { ensureUsersTable } from "./models/userModel.js";
import { ensureProductsTable, seedIfEmpty } from "./models/productModel.js";
import apiRouter from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { UPLOADS_DIR } from "./middleware/upload.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "7titaaa-api" });
});

app.use(
  "/uploads",
  (_req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(UPLOADS_DIR)
);

app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await ensureDatabase();
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    await ensureUsersTable();
    await ensureProductsTable();
    await seedIfEmpty();
    console.log("MySQL connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

start();
