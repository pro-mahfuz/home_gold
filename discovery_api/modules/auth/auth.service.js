import { hash, compare } from "bcryptjs";
import { generateAccessToken, generateRefreshToken, isValidRefreshToken, isTokenExpired } from "../../utils/token.js";
import { Business, User, Role, Permission, Profile, TokenStore } from "../../models/model.js";
import { errorResponse } from "../../utils/errors.js";

export const register = async ({ name, email, password, roleId }) => {
  
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) throw errorResponse("User already exists", { email: "Email is already registered" }, 409);

    const roleObj = await Role.findOne({ where: { id: roleId } });
    if (!roleObj) throw errorResponse("Invalid role", { role: "Invalid role" }, 404);

    const hashed = await hash(password, 10);
    const user = await User.create({ name, email, password: hashed, RoleId: roleObj.id, isActive: false });

    return user;
}

export const login = async ({ email, password, rememberMe }) => {

    //const user = await User.scope("withPassword").findOne({ where: { email }, include: [Role, Profile] });
    const user = await User.scope("withPassword").findOne({
        where: { email },
        include: [
            { model: Business, as: 'business' },
            { 
                model: Role,
                include: [{ model: Permission, as: 'permissions' }], 
                as: 'role' 
            },
            { model: Profile, as: 'profile' }
        ],
    });
    
    if (!user) throw errorResponse("User not found", { userId: "No user found with the given ID" }, 404);
    if (!user.isActive)  throw errorResponse("Your account is not active. Please contact support.", { account: "Account is not active." }, 403);
    if (!(await compare(password, user.password))) throw errorResponse("Invalid Credentials", { email: "Invalid email or password" }, 401);

    const payload = { id: user.id, roleId: user.role.id, role: user.role.name };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    
    const refreshTokenExpiryMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 7d or 1d
    await TokenStore.create({
        userId: payload.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + refreshTokenExpiryMs)
    });

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            countryCode: user.countryCode,
            phoneCode: user.phoneCode,
            phoneNumber: user.phoneNumber,
            business: {
                id: user.role.id === 1 ? 0 : user.business?.id ?? 0,
                businessName: user.business?.businessName,
                businessLogo: user.business?.businessLogo,
                businessLiceseNo: user.business?.businessLiceseNo,
                businessLiceseCopy: user.business?.businessLiceseCopy
            },
            role: {
                id: user.role.id,
                name: user.role.name,
                action: user.role.action,
                permissions: user.role.permissions.map(p => ({
                    id: p.id,
                    name: p.name,
                    action: p.action
                }))
            },
            profile: user.profile,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    };
};

export const isAccessTokenExpired = async ({ accessToken }) => {
    if (!accessToken) throw { status: 400, message: "Access token required" };
    try {
        const decoded = isTokenExpired(accessToken);
        return decoded;
    } catch (error) {
        throw { status: 401, message: "Invalid or expired access token" };
    }
}

export const refreshToken = async ({ refreshToken }) => {
    
    const decoded = await isValidRefreshToken(refreshToken); 
    const payload = { id: decoded.id, roleId: decoded.roleId, role: decoded.role };

    // const stored = await TokenStore.findOne({ where: { token: refreshToken } });
    // if (!stored) throw { status: 403, message: "Token not found or expired" };
    // if (stored.expiresAt < new Date()) {
    //     throw { status: 403, message: "Refresh token has expired, Please login again" };
    // }
    
    
    const accessToken = generateAccessToken(payload);

    // const tokenInDB = await TokenStore.findOne({ where: { token: refreshToken } });
    // if (!tokenInDB) {
    //     await TokenStore.destroy({ where: { userId: decoded?.id } });
    //     return res.status(403).json({ message: "Token reuse detected, session revoked" });
    // }

    const newRefreshToken = generateRefreshToken(payload);
    // await tokenInDB.destroy();
    // await TokenStore.create({
    //     userId: payload.id,
    //     token: newRefreshToken,
    //     expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // example: 7 days
    // });
    
    return { accessToken: accessToken, refreshToken: newRefreshToken };
};

export const logout = async ({refreshToken}) => {
  if (!refreshToken) throw { status: 400, message: "Token required" };

  await TokenStore.destroy({ where: { token: refreshToken } });

  return null;
};

export const logoutFromAllDevices = async (userId) => {
  if (!userId) throw { status: 400, message: "User ID required" };

  await TokenStore.destroy({
    where: { userId },
  });

  return null;
};