import jwt from "jsonwebtoken";

export const requireAuth = (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    const err = new Error("Authentication required");
    err.status = 401;
    return next(err);
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    const err = new Error("Invalid or expired token");
    err.status = 401;
    next(err);
  }
};

export const requireRole = (...allowed) => (req, _res, next) => {
  if (!req.user || !allowed.includes(req.user.role)) {
    const err = new Error("Forbidden");
    err.status = 403;
    return next(err);
  }
  next();
};
