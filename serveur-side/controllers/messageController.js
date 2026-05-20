import { createMessage, listMessages, markMessageRead, deleteMessage } from "../models/messageModel.js";

export const create = async (req, res, next) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const msg = await createMessage({ firstName, lastName, email, subject, message });
    res.status(201).json({ message: msg });
  } catch (err) {
    next(err);
  }
};

export const list = async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const data = await listMessages({ limit, offset });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const patchRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    await markMessageRead(id, isRead !== false);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await deleteMessage(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
