import { pool } from "../config/db.js";

export const ensureUsersTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const [cols] = await pool.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'`
  );
  if (cols.length === 0) {
    await pool.query(
      `ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') NOT NULL DEFAULT 'user' AFTER password`
    );
  }
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT id, name, email, password, role, created_at FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
};

export const findUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
};

export const createUser = async ({ name, email, passwordHash, role = "user" }) => {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, role]
  );
  return { id: result.insertId, name, email, role };
};

export const findUserByEmailExcludingId = async (email, id) => {
  const [rows] = await pool.query(
    "SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1",
    [email, id]
  );
  return rows[0] || null;
};

export const updateUserProfile = async (id, { name, email }) => {
  await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id]);
  return findUserById(id);
};

export const getUserPasswordHash = async (id) => {
  const [rows] = await pool.query("SELECT password FROM users WHERE id = ? LIMIT 1", [id]);
  return rows[0]?.password || null;
};

export const updateUserPassword = async (id, passwordHash) => {
  await pool.query("UPDATE users SET password = ? WHERE id = ?", [passwordHash, id]);
};
