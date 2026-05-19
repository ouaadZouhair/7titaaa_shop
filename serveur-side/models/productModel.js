import { pool } from "../config/db.js";

export const ensureProductsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(190) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      original_price DECIMAL(10,2) NULL,
      category VARCHAR(100) NOT NULL,
      image VARCHAR(500) NOT NULL,
      images JSON NULL,
      description TEXT NULL,
      size VARCHAR(20) NULL,
      is_new TINYINT(1) NOT NULL DEFAULT 0,
      is_featured TINYINT(1) NOT NULL DEFAULT 0,
      rating DECIMAL(2,1) NOT NULL DEFAULT 0,
      reviews INT NOT NULL DEFAULT 0,
      tags JSON NULL,
      quality TINYINT(1) NOT NULL DEFAULT 5,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_category (category),
      INDEX idx_featured (is_featured),
      INDEX idx_new (is_new)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  // add quality column to existing tables that pre-date this field
  await pool.query(`
    ALTER TABLE products ADD COLUMN IF NOT EXISTS quality TINYINT(1) NOT NULL DEFAULT 5
  `).catch(() => {});
};

const rowToProduct = (row) => {
  if (!row) return null;
  const parse = (v) => {
    if (v == null) return [];
    if (Array.isArray(v)) return v;
    try { return JSON.parse(v); } catch { return []; }
  };
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    originalPrice: row.original_price == null ? null : Number(row.original_price),
    category: row.category,
    image: row.image,
    images: parse(row.images),
    description: row.description,
    size: row.size,
    isNew: !!row.is_new,
    isFeatured: !!row.is_featured,
    rating: Number(row.rating),
    reviews: row.reviews,
    tags: parse(row.tags),
    quality: row.quality != null ? Number(row.quality) : 5,
    created_at: row.created_at,
  };
};

export const listProducts = async ({ search, category, limit = 100, offset = 0 } = {}) => {
  const where = [];
  const params = [];
  if (search) {
    where.push("(name LIKE ? OR description LIKE ? OR tags LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (category && category !== "all") {
    where.push("category = ?");
    params.push(category);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const safeLimit = Math.max(1, Math.min(Number(limit) || 100, 200));
  const safeOffset = Math.max(0, Number(offset) || 0);

  const [rows] = await pool.query(
    `SELECT * FROM products ${whereSql} ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    params
  );
  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM products ${whereSql}`,
    params
  );
  return { items: rows.map(rowToProduct), total: countRows[0].total };
};

export const getProductById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
  return rowToProduct(rows[0]);
};

const toRow = (p) => ({
  name: p.name,
  price: p.price,
  original_price: p.originalPrice ?? null,
  category: p.category,
  image: p.image,
  images: JSON.stringify(p.images || []),
  description: p.description || null,
  size: p.size || null,
  is_new: p.isNew ? 1 : 0,
  is_featured: p.isFeatured ? 1 : 0,
  rating: p.rating ?? 0,
  reviews: p.reviews ?? 0,
  tags: JSON.stringify(p.tags || []),
  quality: Math.min(5, Math.max(1, Number(p.quality) || 5)),
});

export const createProduct = async (p) => {
  const row = toRow(p);
  const [result] = await pool.query(
    `INSERT INTO products (name, price, original_price, category, image, images, description, size, is_new, is_featured, rating, reviews, tags, quality)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      row.name, row.price, row.original_price, row.category, row.image, row.images,
      row.description, row.size, row.is_new, row.is_featured, row.rating, row.reviews, row.tags, row.quality,
    ]
  );
  return getProductById(result.insertId);
};

export const updateProduct = async (id, p) => {
  const row = toRow(p);
  await pool.query(
    `UPDATE products SET name=?, price=?, original_price=?, category=?, image=?, images=?, description=?, size=?, is_new=?, is_featured=?, rating=?, reviews=?, tags=?, quality=?
     WHERE id=?`,
    [
      row.name, row.price, row.original_price, row.category, row.image, row.images,
      row.description, row.size, row.is_new, row.is_featured, row.rating, row.reviews, row.tags, row.quality,
      id,
    ]
  );
  return getProductById(id);
};

export const deleteProduct = async (id) => {
  const [result] = await pool.query("DELETE FROM products WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

export const countProducts = async () => {
  const [rows] = await pool.query(
    `SELECT
       COUNT(*) AS total,
       SUM(is_featured) AS featured,
       SUM(is_new) AS new_count,
       COUNT(DISTINCT category) AS categories
     FROM products`
  );
  return {
    total: rows[0].total || 0,
    featured: Number(rows[0].featured) || 0,
    new: Number(rows[0].new_count) || 0,
    categories: rows[0].categories || 0,
  };
};

export const listCategories = async () => {
  const [rows] = await pool.query(
    "SELECT category, COUNT(*) AS count FROM products GROUP BY category ORDER BY count DESC"
  );
  return rows;
};
