import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";

import apiRouter from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { UPLOADS_DIR } from "./middleware/upload.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
}));

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
