import { query, getClient, toPg } from "../config/db.js";

export const ensureOrdersTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      ref VARCHAR(20) NOT NULL UNIQUE,
      status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(200) NOT NULL,
      address TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      subtotal NUMERIC(10,2) NOT NULL,
      shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
      total NUMERIC(10,2) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await query(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at)`);
  // Drop legacy JSON column from tables that pre-date this migration
  await query(`ALTER TABLE orders DROP COLUMN IF EXISTS items`).catch(() => {});
};

/**
 * order_items — links orders ↔ products via foreign keys.
 * Snapshot columns (name, unit_price, image) preserve order history
 * even if the product is later edited or deleted.
 * product_id is nullable: ON DELETE SET NULL keeps the row if the
 * product is removed while still recording what was ordered.
 */
export const ensureOrderItemsTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id           SERIAL PRIMARY KEY,
      order_id     INT NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
      product_id   INT          REFERENCES products(id) ON DELETE SET NULL,
      quantity     INT NOT NULL DEFAULT 1,
      unit_price   NUMERIC(10,2) NOT NULL,
      name         VARCHAR(190) NOT NULL,
      image        VARCHAR(500),
      size         VARCHAR(20),
      type         VARCHAR(20) DEFAULT 'Normal',
      created_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await query(`CREATE INDEX IF NOT EXISTS idx_oi_order_id ON order_items(order_id)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_oi_product_id ON order_items(product_id)`);
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
  const client = await getClient();
  try {
    await client.query("BEGIN");

    // 1. Insert the order header
    const ins = await client.query(
      toPg(`INSERT INTO orders (ref, first_name, last_name, phone, email, address, city, subtotal, shipping, total)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`),
      [ref, firstName, lastName, phone, email, address, city, subtotal, shipping, total]
    );
    const orderId = ins.rows[0].id;

    // 2. Insert each item into order_items (FK link to products)
    if (Array.isArray(items) && items.length > 0) {
      const cols = 8; // order_id, product_id, quantity, unit_price, name, image, size, type
      const values = [];
      const tuples = items.map((item, idx) => {
        const base = idx * cols;
        values.push(
          orderId,
          item.id || item.productId || null,  // product_id (FK) — null if not provided
          item.quantity || 1,
          item.price ?? item.unit_price ?? 0,  // snapshot price
          item.name || "",                      // snapshot name
          item.image || null,                   // snapshot image
          item.size || null,
          item.type || 'Normal'
        );
        const ph = Array.from({ length: cols }, (_, j) => `$${base + j + 1}`);
        return `(${ph.join(", ")})`;
      });
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, name, image, size, type)
         VALUES ${tuples.join(", ")}`,
        values
      );
    }

    await client.query("COMMIT");

    const { rows } = await client.query(
      toPg("SELECT * FROM orders WHERE id = ? LIMIT 1"),
      [orderId]
    );
    const order = rowToOrder(rows[0]);
    // Attach the relational items
    const { rows: ois } = await client.query(
      toPg(`SELECT oi.*, p.category, p.rating
            FROM order_items oi
            LEFT JOIN products p ON p.id = oi.product_id
            WHERE oi.order_id = ?`),
      [orderId]
    );
    order.orderItems = ois;
    return order;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const listOrders = async ({ limit = 50, offset = 0, status } = {}) => {
  const where = status ? "WHERE status = ?" : "";
  const params = status ? [status] : [];
  const safeLimit = Math.max(1, Math.min(Number(limit) || 50, 200));
  const safeOffset = Math.max(0, Number(offset) || 0);

  const { rows } = await query(
    `SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    params
  );
  const { rows: countRows } = await query(
    `SELECT COUNT(*) AS total FROM orders ${where}`,
    params
  );

  const orders = rows.map(rowToOrder);

  // Enrich each order with relational order_items (joined to products)
  if (orders.length > 0) {
    const orderIds = orders.map((o) => o.id);
    const { rows: ois } = await query(
      `SELECT oi.*, p.category, p.rating
       FROM order_items oi
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ANY(?)`,
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

  return { orders, total: Number(countRows[0].total) };
};

export const getOrderById = async (id) => {
  const { rows } = await query("SELECT * FROM orders WHERE id = ? LIMIT 1", [id]);
  if (!rows[0]) return null;
  const order = rowToOrder(rows[0]);
  const { rows: ois } = await query(
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
  await query("UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?", [status, id]);
  const { rows } = await query("SELECT * FROM orders WHERE id = ? LIMIT 1", [id]);
  if (!rows[0]) return null;
  return rowToOrder(rows[0]);
};
