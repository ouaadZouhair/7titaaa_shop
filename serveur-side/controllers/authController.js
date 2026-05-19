import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  findUserById,
  createUser,
  findUserByEmailExcludingId,
  updateUserProfile,
  getUserPasswordHash,
  updateUserPassword,
} from "../models/userModel.js";

const signToken = (user) =>
  jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

const sanitize = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      const err = new Error("name, email, and password are required");
      err.status = 400;
      throw err;
    }
    if (password.length < 6) {
      const err = new Error("Password must be at least 6 characters");
      err.status = 400;
      throw err;
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      const err = new Error("Email is already registered");
      err.status = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, passwordHash });
    const token = signToken(user);

    res.status(201).json({ user: sanitize(user), token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      const err = new Error("email and password are required");
      err.status = 400;
      throw err;
    }

    const user = await findUserByEmail(email);
    if (!user) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }

    const token = signToken(user);
    res.json({ user: sanitize(user), token });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body || {};
    if (!name || !email) {
      const err = new Error("name and email are required");
      err.status = 400;
      throw err;
    }

    const taken = await findUserByEmailExcludingId(email, req.user.id);
    if (taken) {
      const err = new Error("Email is already in use");
      err.status = 409;
      throw err;
    }

    const user = await updateUserProfile(req.user.id, { name, email });
    const token = signToken(user);
    res.json({ user: sanitize(user), token });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      const err = new Error("currentPassword and newPassword are required");
      err.status = 400;
      throw err;
    }
    if (newPassword.length < 6) {
      const err = new Error("New password must be at least 6 characters");
      err.status = 400;
      throw err;
    }

    const currentHash = await getUserPasswordHash(req.user.id);
    if (!currentHash) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }

    const ok = await bcrypt.compare(currentPassword, currentHash);
    if (!ok) {
      const err = new Error("Current password is incorrect");
      err.status = 401;
      throw err;
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(req.user.id, newHash);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
