import "dotenv/config";
import app from "./app.js";
import { pool } from "./config/db.js";
import { initDb } from "./scripts/initDb.js";

const PORT = process.env.PORT || 5000;

/**
 * Local development entry point. On Vercel the app is served by api/index.js
 * as a serverless function, so this listen() never runs there.
 */
const start = async () => {
  try {
    // Verify the connection and create tables if they don't exist yet.
    await initDb();
    console.log("PostgreSQL connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    await pool.end().catch(() => {});
    process.exit(1);
  }
};

start();
