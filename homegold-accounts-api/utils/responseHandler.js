

export const success = (res, data = {}, message = "Success", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const error = (res, message = "Something went wrong", status = 500, errors = null, stack = null) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === "development" && stack && { stack }),
  });
};

