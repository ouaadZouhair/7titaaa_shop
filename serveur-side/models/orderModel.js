import { pool } from "../config/db.js";

export const ensureOrdersTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ref VARCHAR(20) NOT NULL UNIQUE,
      status ENUM('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(200) NOT NULL,
      address TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      subtotal DECIMAL(10,2) NOT NULL,
      shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
      total DECIMAL(10,2) NOT NULL,
      items JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_status (status),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
};

const rowToOrder = (row) => ({
  id: row.id,
  ref: row.ref,
  status: row.status,
  firstName: row.first_name,
  lastName: row.last_name,
  phone: row.phone,
  email: row.email,
  address: row.address,
  city: row.city,
  subtotal: Number(row.subtotal),
  shipping: Number(row.shipping),
  total: Number(row.total),
  items: Array.isArray(row.items) ? row.items : JSON.parse(row.items || "[]"),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const createOrder = async ({ firstName, lastName, phone, email, address, city, subtotal, shipping, total, items }) => {
  const ref = `7T-${Math.floor(Math.random() * 90000 + 10000)}`;
  const [result] = await pool.query(
    `INSERT INTO orders (ref, first_name, last_name, phone, email, address, city, subtotal, shipping, total, items)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [ref, firstName, lastName, phone, email, address, city, subtotal, shipping, total, JSON.stringify(items)]
  );
  const [rows] = await pool.query("SELECT * FROM orders WHERE id = ? LIMIT 1", [result.insertId]);
  return rowToOrder(rows[0]);
};

export const listOrders = async ({ limit = 50, offset = 0, status } = {}) => {
  const where = status ? "WHERE status = ?" : "";
  const params = status ? [status] : [];
  const safeLimit = Math.max(1, Math.min(Number(limit) || 50, 200));
  const safeOffset = Math.max(0, Number(offset) || 0);

  const [rows] = await pool.query(
    `SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    params
  );
  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM orders ${where}`,
    params
  );
  return { orders: rows.map(rowToOrder), total: countRows[0].total };
};

export const updateOrderStatus = async (id, status) => {
  await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
  const [rows] = await pool.query("SELECT * FROM orders WHERE id = ? LIMIT 1", [id]);
  if (!rows[0]) return null;
  return rowToOrder(rows[0]);
};
