export const notFound = (req, res, _next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  console.error(err);
  res.status(status).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
