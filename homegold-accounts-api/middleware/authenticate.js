import { error } from "../utils/responseHandler.js";
import { getTokenFromRequest, isValidAccessToken, decodeToken } from "../utils/token.js";
import { User } from "../models/model.js";
export async function authenticate(req, res, next) {
  // Middleware to authenticate user based on access token
  try {
    const token = getTokenFromRequest(req);
    if (!token) throw { status: 401, message: "Missing or invalid token" };

    const decoded = isValidAccessToken(token);
    if (!decoded) throw { status: 401, message: "Invalid or expired token, Please refresh token" };
    
    const user = await User.findByPk(decoded.id);
    if (!user) throw { status: 401, message: 'User not found' };

    req.user = user;
    next();
  } catch (err) {
    return error(res, "Invalid or expired token!", 401 || 500, err, err.stack);
  }
  // Note: Ensure that `getTokenFromRequest` and `isValidAccessToken` are properly defined in your utils/token.js

}