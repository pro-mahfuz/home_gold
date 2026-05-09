import { Role, Permission } from "../models/model.js";
/**
 * Middleware to authorize user based on permissions.
 * It checks if the user has the required permission to access a route.
 *
 * @param {string} permissionName - The name of the permission to check.
 * @returns {function} - Express middleware function.
 */
export const authorize = (permissionActions) => {
  return async (req, res, next) => {
    try {
      const userRole = await Role.findByPk(req.user.roleId, {
        include: {
          model: Permission,
          through: { attributes: [] },  // exclude RolePermission fields
          as: "permissions",
        },
      });

      const requiredPermissions = Array.isArray(permissionActions)
        ? permissionActions
        : [permissionActions];

      const hasPermission = userRole?.permissions?.some((perm) =>
        requiredPermissions.includes(perm.action)
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: "Server error during authorization" });
    }
  };
};


