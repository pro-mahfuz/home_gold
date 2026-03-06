export class AppError extends Error {
  constructor(message, statusCode = 400, errors = {}) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const errorResponse = (message, errors = {}, statusCode = 400) => {
  return new AppError(message, statusCode, errors);
};