import { error } from "../utils/responseHandler.js";

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      req.validated = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      next();
    } catch (err) {
      const errors = err.inner?.map((e) => ({
        field: e.path,
        message: e.message,
      }));

      return error(res, err.message, err.status || 500, errors, err.stack);

      // res.status(400).json({
      //   message: "Validation failed",
      //   errors,
      // });
    }
  };
};