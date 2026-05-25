import { query } from "../config/db.js";

export const ensureProductsTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(190) NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      original_price NUMERIC(10,2),
      category VARCHAR(100) NOT NULL,
      image VARCHAR(500) NOT NULL,
      images JSONB,
      description TEXT,
      size VARCHAR(20),
      type VARCHAR(20) DEFAULT 'Normal',
      is_new BOOLEAN NOT NULL DEFAULT FALSE,
      is_featured BOOLEAN NOT NULL DEFAULT FALSE,
      rating NUMERIC(2,1) NOT NULL DEFAULT 0,
      reviews INT NOT NULL DEFAULT 0,
      tags JSONB,
      quality SMALLINT NOT NULL DEFAULT 5,
      is_available BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await query(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_products_new ON products(is_new)`);

  // migrations for columns added after initial release
  await query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS quality SMALLINT NOT NULL DEFAULT 5`).catch(() => {});
  await query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'Normal'`).catch(() => {});
  await query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS is_available BOOLEAN NOT NULL DEFAULT TRUE`).catch(() => {});
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
    type: row.type || 'Normal',
    isNew: !!row.is_new,
    isFeatured: !!row.is_featured,
    rating: Number(row.rating),
    reviews: row.reviews,
    tags: parse(row.tags),
    quality: row.quality != null ? Number(row.quality) : 5,
    isAvailable: row.is_available == null ? true : !!row.is_available,
    created_at: row.created_at,
  };
};

export const listProducts = async ({ search, category, limit = 100, offset = 0 } = {}) => {
  const where = [];
  const params = [];
  if (search) {
    // tags is JSONB — cast to text so the LIKE applies to its raw contents.
    where.push("(name ILIKE ? OR description ILIKE ? OR tags::text ILIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (category && category !== "all") {
    where.push("category = ?");
    params.push(category);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const safeLimit = Math.max(1, Math.min(Number(limit) || 100, 200));
  const safeOffset = Math.max(0, Number(offset) || 0);

  const { rows } = await query(
    `SELECT * FROM products ${whereSql} ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    params
  );
  const { rows: countRows } = await query(
    `SELECT COUNT(*) AS total FROM products ${whereSql}`,
    params
  );
  return { items: rows.map(rowToProduct), total: Number(countRows[0].total) };
};

export const getProductById = async (id) => {
  const { rows } = await query("SELECT * FROM products WHERE id = ? LIMIT 1", [id]);
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
  type: p.type || 'Normal',
  is_new: !!p.isNew,
  is_featured: !!p.isFeatured,
  rating: p.rating ?? 0,
  reviews: p.reviews ?? 0,
  tags: JSON.stringify(p.tags || []),
  quality: Math.min(5, Math.max(1, Number(p.quality) || 5)),
  is_available: p.isAvailable !== false,
});

export const createProduct = async (p) => {
  const row = toRow(p);
  const { rows } = await query(
    `INSERT INTO products (name, price, original_price, category, image, images, description, size, type, is_new, is_featured, rating, reviews, tags, quality, is_available)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    [
      row.name, row.price, row.original_price, row.category, row.image, row.images,
      row.description, row.size, row.type, row.is_new, row.is_featured, row.rating, row.reviews, row.tags, row.quality, row.is_available,
    ]
  );
  return getProductById(rows[0].id);
};

export const updateProduct = async (id, p) => {
  const row = toRow(p);
  await query(
    `UPDATE products SET name=?, price=?, original_price=?, category=?, image=?, images=?, description=?, size=?, type=?, is_new=?, is_featured=?, rating=?, reviews=?, tags=?, quality=?, is_available=?
     WHERE id=?`,
    [
      row.name, row.price, row.original_price, row.category, row.image, row.images,
      row.description, row.size, row.type, row.is_new, row.is_featured, row.rating, row.reviews, row.tags, row.quality, row.is_available,
      id,
    ]
  );
  return getProductById(id);
};

export const setProductAvailability = async (id, isAvailable) => {
  await query("UPDATE products SET is_available = ? WHERE id = ?", [!!isAvailable, id]);
  return getProductById(id);
};

export const deleteProduct = async (id) => {
  const result = await query("DELETE FROM products WHERE id = ?", [id]);
  return result.rowCount > 0;
};

export const countProducts = async () => {
  const { rows } = await query(
    `SELECT
       COUNT(*) AS total,
       COUNT(*) FILTER (WHERE is_featured) AS featured,
       COUNT(*) FILTER (WHERE is_new) AS new_count,
       COUNT(DISTINCT category) AS categories
     FROM products`
  );
  return {
    total: Number(rows[0].total) || 0,
    featured: Number(rows[0].featured) || 0,
    new: Number(rows[0].new_count) || 0,
    categories: Number(rows[0].categories) || 0,
  };
};

export const listCategories = async () => {
  const { rows } = await query(
    "SELECT category, COUNT(*) AS count FROM products GROUP BY category ORDER BY count DESC"
  );
  return rows.map((r) => ({ category: r.category, count: Number(r.count) }));
};
