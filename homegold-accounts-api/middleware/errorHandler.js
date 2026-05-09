import { AppError } from "../utils/errors.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const status = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Something went wrong";
  const errors = err.errors || {};

  res.status(status).json({ message, errors });
};

export default errorHandler;
