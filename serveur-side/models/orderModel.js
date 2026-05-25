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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_status (status),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  // Drop legacy JSON column from tables that pre-date this migration
  await pool.query(`ALTER TABLE orders DROP COLUMN IF EXISTS items`).catch(() => {});
};

/**
 * order_items — links orders ↔ products via foreign keys.
 * Snapshot columns (name, unit_price, image) preserve order history
 * even if the product is later edited or deleted.
 * product_id is nullable: ON DELETE SET NULL keeps the row if the
 * product is removed while still recording what was ordered.
 */
export const ensureOrderItemsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      order_id     INT NOT NULL,
      product_id   INT NULL,
      quantity     INT NOT NULL DEFAULT 1,
      unit_price   DECIMAL(10,2) NOT NULL,
      name         VARCHAR(190) NOT NULL,
      image        VARCHAR(500) NULL,
      size         VARCHAR(20) NULL,
      type         VARCHAR(20) NULL DEFAULT 'Normal',
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_oi_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
      CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
      INDEX idx_oi_order_id   (order_id),
      INDEX idx_oi_product_id (product_id)
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
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const createOrder = async ({ firstName, lastName, phone, email, address, city, subtotal, shipping, total, items }) => {
  const ref = `7T-${Math.floor(Math.random() * 90000 + 10000)}`;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Insert the order header
    const [result] = await conn.query(
      `INSERT INTO orders (ref, first_name, last_name, phone, email, address, city, subtotal, shipping, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ref, firstName, lastName, phone, email, address, city, subtotal, shipping, total]
    );
    const orderId = result.insertId;

    // 2. Insert each item into order_items (FK link to products)
    if (Array.isArray(items) && items.length > 0) {
      const itemRows = items.map((item) => [
        orderId,
        item.id || item.productId || null,   // product_id (FK) — null if not provided
        item.quantity || 1,
        item.price ?? item.unit_price ?? 0,  // snapshot price
        item.name || "",                      // snapshot name
        item.image || null,                   // snapshot image
        item.size || null,
        item.type || 'Normal',
      ]);
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, name, image, size, type)
         VALUES ?`,
        [itemRows]
      );
    }

    await conn.commit();

    const [rows] = await conn.query("SELECT * FROM orders WHERE id = ? LIMIT 1", [orderId]);
    const order = rowToOrder(rows[0]);
    // Attach the relational items
    const [ois] = await conn.query(
      `SELECT oi.*, p.category, p.rating
       FROM order_items oi
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    order.orderItems = ois;
    return order;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
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

  const orders = rows.map(rowToOrder);

  // Enrich each order with relational order_items (joined to products)
  if (orders.length > 0) {
    const orderIds = orders.map((o) => o.id);
    const [ois] = await pool.query(
      `SELECT oi.*, p.category, p.rating
       FROM order_items oi
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id IN (?)`,
      [orderIds]
    );
    const itemsByOrder = {};
    for (const oi of ois) {
      if (!itemsByOrder[oi.order_id]) itemsByOrder[oi.order_id] = [];
      itemsByOrder[oi.order_id].push(oi);
    }
    for (const order of orders) {
      order.orderItems = itemsByOrder[order.id] || [];
    }
  }

  return { orders, total: countRows[0].total };
};

export const getOrderById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM orders WHERE id = ? LIMIT 1", [id]);
  if (!rows[0]) return null;
  const order = rowToOrder(rows[0]);
  const [ois] = await pool.query(
    `SELECT oi.*, p.category, p.rating
     FROM order_items oi
     LEFT JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = ?`,
    [id]
  );
  order.orderItems = ois;
  return order;
};

export const updateOrderStatus = async (id, status) => {
  await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
  const [rows] = await pool.query("SELECT * FROM orders WHERE id = ? LIMIT 1", [id]);
  if (!rows[0]) return null;
  return rowToOrder(rows[0]);
};
