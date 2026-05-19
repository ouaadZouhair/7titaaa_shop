import {
  listProducts,
  getProductById,
  createProduct as createProductModel,
  updateProduct as updateProductModel,
  deleteProduct as deleteProductModel,
  countProducts,
  listCategories,
} from "../models/productModel.js";

const validateProduct = (body) => {
  const required = ["name", "price", "category", "image"];
  for (const key of required) {
    if (body[key] === undefined || body[key] === null || body[key] === "") {
      const err = new Error(`${key} is required`);
      err.status = 400;
      throw err;
    }
  }
  if (isNaN(Number(body.price)) || Number(body.price) < 0) {
    const err = new Error("price must be a non-negative number");
    err.status = 400;
    throw err;
  }
};

export const list = async (req, res, next) => {
  try {
    const { search, category, limit, offset } = req.query;
    const data = await listProducts({ search, category, limit, offset });
    res.json(data);
  } catch (err) { next(err); }
};

export const getOne = async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      const err = new Error("Product not found");
      err.status = 404;
      throw err;
    }
    res.json({ product });
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    validateProduct(req.body);
    const product = await createProductModel(req.body);
    res.status(201).json({ product });
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    validateProduct(req.body);
    const existing = await getProductById(req.params.id);
    if (!existing) {
      const err = new Error("Product not found");
      err.status = 404;
      throw err;
    }
    const product = await updateProductModel(req.params.id, req.body);
    res.json({ product });
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const ok = await deleteProductModel(req.params.id);
    if (!ok) {
      const err = new Error("Product not found");
      err.status = 404;
      throw err;
    }
    res.json({ success: true });
  } catch (err) { next(err); }
};

export const stats = async (_req, res, next) => {
  try {
    const products = await countProducts();
    const categories = await listCategories();
    res.json({ products, categories });
  } catch (err) { next(err); }
};
