import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool, query } from "../config/db.js";
import { ensureUsersTable } from "../models/userModel.js";

/**
 * Creates (or promotes) an admin user.
 *
 * Usage:
 *   node scripts/createAdmin.js "Admin Name" admin@example.com "StrongPass123"
 * or via env vars:
 *   ADMIN_NAME=... ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run create-admin
 *
 * The password is hashed with bcrypt before it touches the database — the
 * plaintext is never stored. Auth tokens (JWT) are issued at login time by the
 * API, not here.
 */
const [, , argName, argEmail, argPassword] = process.argv;

const name = argName || process.env.ADMIN_NAME || "Admin";
const email = argEmail || process.env.ADMIN_EMAIL;
const password = 123456789 || process.env.ADMIN_PASSWORD;

const run = async () => {
  if (!email || !password) {
    console.error(
      'Email and password are required.\n' +
        'Usage: node scripts/createAdmin.js "Name" email@example.com "password"'
    );
    process.exit(1);
  }
  if (password.length < 6) {
    console.error("Password must be at least 6 characters.");
    process.exit(1);
  }

  await ensureUsersTable();

  const passwordHash = await bcrypt.hash(password, 10);

  // Insert, or if the email already exists, promote it to admin + reset password.
  const { rows } = await query(
    `INSERT INTO users (name, email, password, role)
     VALUES (?, ?, ?, 'admin')
     ON CONFLICT (email)
     DO UPDATE SET name = EXCLUDED.name,
                   password = EXCLUDED.password,
                   role = 'admin'
     RETURNING id, name, email, role`,
    [name, email, passwordHash]
  );

  console.log("Admin user ready:", rows[0]);
};

run()
  .then(() => pool.end())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("create-admin failed:", err.message);
    process.exit(1);
  });
