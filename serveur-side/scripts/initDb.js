import "dotenv/config";
import { pool } from "../config/db.js";
import { ensureUsersTable } from "../models/userModel.js";
import { ensureProductsTable } from "../models/productModel.js";
import { ensureOrdersTable, ensureOrderItemsTable } from "../models/orderModel.js";
import { ensureMessagesTable } from "../models/messageModel.js";

/**
 * Creates every table (and the indexes/constraints) if they don't exist.
 * Order matters: order_items has FKs to both orders and products.
 */
export const initDb = async () => {
  await ensureUsersTable();
  await ensureProductsTable();
  await ensureOrdersTable();
  await ensureOrderItemsTable(); // FK: order_items → orders + products
  await ensureMessagesTable();
};

// Allow running directly:  npm run init-db
const isMain = import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith("initDb.js");

if (isMain) {
  initDb()
    .then(() => {
      console.log("Database schema is ready.");
      return pool.end();
    })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("init-db failed:", err.message);
      process.exit(1);
    });
}
