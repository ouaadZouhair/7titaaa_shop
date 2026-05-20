import { pool } from "../config/db.js";

export const ensureMessagesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(100) NOT NULL DEFAULT 'general',
      message TEXT NOT NULL,
      is_read TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_read (is_read),
      INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
};

const rowToMessage = (row) => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  subject: row.subject,
  message: row.message,
  isRead: !!row.is_read,
  createdAt: row.created_at,
});

export const createMessage = async ({ firstName, lastName, email, subject, message }) => {
  const [result] = await pool.query(
    `INSERT INTO messages (first_name, last_name, email, subject, message) VALUES (?, ?, ?, ?, ?)`,
    [firstName, lastName, email, subject || "general", message]
  );
  const [rows] = await pool.query("SELECT * FROM messages WHERE id = ?", [result.insertId]);
  return rowToMessage(rows[0]);
};

export const listMessages = async ({ limit = 50, offset = 0 } = {}) => {
  const safeLimit = Math.min(Number(limit) || 50, 200);
  const safeOffset = Math.max(0, Number(offset) || 0);
  const [rows] = await pool.query(
    `SELECT * FROM messages ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`
  );
  const [countRows] = await pool.query("SELECT COUNT(*) AS total FROM messages");
  const [unreadRows] = await pool.query("SELECT COUNT(*) AS unread FROM messages WHERE is_read = 0");
  return {
    items: rows.map(rowToMessage),
    total: countRows[0].total,
    unread: unreadRows[0].unread,
  };
};

export const markMessageRead = async (id, isRead = true) => {
  await pool.query("UPDATE messages SET is_read = ? WHERE id = ?", [isRead ? 1 : 0, id]);
};

export const deleteMessage = async (id) => {
  const [result] = await pool.query("DELETE FROM messages WHERE id = ?", [id]);
  return result.affectedRows > 0;
};
