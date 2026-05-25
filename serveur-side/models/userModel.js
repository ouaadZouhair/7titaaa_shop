import { query } from "../config/db.js";

export const ensureUsersTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Backfill the role column on databases created before it existed.
  await query(
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(10) NOT NULL DEFAULT 'user'`
  );
};

export const findUserByEmail = async (email) => {
  const { rows } = await query(
    "SELECT id, name, email, password, role, created_at FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
};

export const findUserById = async (id) => {
  const { rows } = await query(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
};

export const createUser = async ({ name, email, passwordHash, role = "user" }) => {
  const { rows } = await query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) RETURNING id",
    [name, email, passwordHash, role]
  );
  return { id: rows[0].id, name, email, role };
};

export const findUserByEmailExcludingId = async (email, id) => {
  const { rows } = await query(
    "SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1",
    [email, id]
  );
  return rows[0] || null;
};

export const updateUserProfile = async (id, { name, email }) => {
  await query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id]);
  return findUserById(id);
};

export const getUserPasswordHash = async (id) => {
  const { rows } = await query("SELECT password FROM users WHERE id = ? LIMIT 1", [id]);
  return rows[0]?.password || null;
};

export const updateUserPassword = async (id, passwordHash) => {
  await query("UPDATE users SET password = ? WHERE id = ?", [passwordHash, id]);
};
