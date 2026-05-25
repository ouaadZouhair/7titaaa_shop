import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";

import apiRouter from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { UPLOADS_DIR } from "./middleware/upload.js";

const app = express();

// Comma-separated list lets you allow prod + preview/localhost origins at once.
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (curl, server-to-server) with no Origin header.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

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

export default app;
