import { query } from "../config/db.js";

export const ensureMessagesTable = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(100) NOT NULL DEFAULT 'general',
      message TEXT NOT NULL,
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await query(`CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(is_read)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at)`);
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
  const { rows } = await query(
    `INSERT INTO messages (first_name, last_name, email, subject, message)
     VALUES (?, ?, ?, ?, ?) RETURNING *`,
    [firstName, lastName, email, subject || "general", message]
  );
  return rowToMessage(rows[0]);
};

export const listMessages = async ({ limit = 50, offset = 0 } = {}) => {
  const safeLimit = Math.min(Number(limit) || 50, 200);
  const safeOffset = Math.max(0, Number(offset) || 0);
  const { rows } = await query(
    `SELECT * FROM messages ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`
  );
  const { rows: countRows } = await query("SELECT COUNT(*) AS total FROM messages");
  const { rows: unreadRows } = await query(
    "SELECT COUNT(*) AS unread FROM messages WHERE is_read = FALSE"
  );
  return {
    items: rows.map(rowToMessage),
    total: Number(countRows[0].total),
    unread: Number(unreadRows[0].unread),
  };
};

export const markMessageRead = async (id, isRead = true) => {
  await query("UPDATE messages SET is_read = ? WHERE id = ?", [!!isRead, id]);
};

export const deleteMessage = async (id) => {
  const result = await query("DELETE FROM messages WHERE id = ?", [id]);
  return result.rowCount > 0;
};
