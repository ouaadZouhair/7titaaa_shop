import { createOrder, listOrders, getOrderById, updateOrderStatus } from "../models/orderModel.js";

export const create = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, email, address, city, subtotal, shipping, total, items } = req.body;
    if (!firstName || !lastName || !phone || !email || !address || !city) {
      const err = new Error("Missing required customer fields");
      err.status = 400;
      throw err;
    }
    if (!Array.isArray(items) || items.length === 0) {
      const err = new Error("Order must contain at least one item");
      err.status = 400;
      throw err;
    }
    const order = await createOrder({ firstName, lastName, phone, email, address, city, subtotal, shipping, total, items });
    res.status(201).json({ order });
  } catch (err) { next(err); }
};

export const list = async (req, res, next) => {
  try {
    const { limit, offset, status } = req.query;
    const data = await listOrders({ limit, offset, status });
    res.json(data);
  } catch (err) { next(err); }
};

export const getOne = async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      const err = new Error("Order not found");
      err.status = 404;
      throw err;
    }
    res.json({ order });
  } catch (err) { next(err); }
};

export const patchStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      const err = new Error("Invalid status value");
      err.status = 400;
      throw err;
    }
    const order = await updateOrderStatus(req.params.id, status);
    if (!order) {
      const err = new Error("Order not found");
      err.status = 404;
      throw err;
    }
    res.json({ order });
  } catch (err) { next(err); }
};
