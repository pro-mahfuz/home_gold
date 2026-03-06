import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
  return accessToken;
}

export const generateRefreshToken = (payload) =>{
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  return refreshToken;
}

export const isValidAccessToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    throw new Error("Invalid access token");
  }
  return decoded;
}

export const isValidRefreshToken = async (token) => {
  try {
    if (!token) throw new Error("Refresh token missing");
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    if (!decoded) {
      throw new Error("Invalid refresh token");
    }
    return decoded;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
  
  
  
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

// ----Get Token from different sources (START)----
export const getTokenFromHeaders = (headers) => {
  const authHeader = headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization header is missing or invalid");
  }
  return authHeader.split(" ")[1];
}
export const getTokenFromCookies = (cookies) => {
  const token = cookies.token || cookies.refreshToken;
  if (!token) {
    throw new Error("Token is missing from cookies");
  }
  return token;
}
export const getTokenFromBody = (body) => {
  const token = body.token || body.refreshToken;
  if (!token) {
    throw new Error("Token is missing from request body");
  }
  return token;
}
export const getTokenFromQuery = (query) => {
  const token = query.token || query.refreshToken;
  if (!token) {
    throw new Error("Token is missing from query parameters");
  }
  return token;
}
export const getTokenFromRequest = (req) => {
  return (
    getTokenFromHeaders(req.headers) ||
    getTokenFromCookies(req.cookies) ||
    getTokenFromBody(req.body) ||
    getTokenFromQuery(req.query)
  );
}
// ----Get Token from different sources (END)----


export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Token verification failed");
  }
}


