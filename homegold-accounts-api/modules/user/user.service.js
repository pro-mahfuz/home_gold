import { hash, compare } from "bcryptjs";
import { User, Role, Permission, Invoice, Business, Profile } from "../../models/model.js";

export const getAllUser = async () => {
  const users = await User.findAll({
    include: [
      { model: Business, as: 'business' },
      { 
        model: Role,
        include: [{ model: Permission, as: 'permissions' }], 
        as: 'role' 
      },
      { model: Profile, as: 'profile' }
    ]
  });

  if (!users || users.length === 0) {
    throw { status: 400, message: "No users found" };
  }

  return users;
};


export const createUser = async (req) => {
    const { name, email, phone, roleId, password } = req.body;
    console.log("user request body:", req.body);
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw { status: 400, message: "User with this email already exists" };
    }

    const hashed = await hash(password, 10);

    const user = await User.create({
        ...req.body,
        RoleId: roleId, // Ensure RoleId is set correctly
        password: hashed // Default to false if not provided
    });
    console.log("user response body:", user);
    return user;
}

export const getUserById = async (id) => {
    const user = await User.findByPk(id, { 
        include: [
            { model: Business, as: 'business' },
            { 
                model: Role,
                include: [{ model: Permission, as: 'permissions' }], 
                as: 'role' 
            },
            { model: Profile, as: 'profile' }
        ]
    });

    if (!user) {
        throw { status: 404, message: "User not found" };
    }
    return user;
}

export const updateUser = async (req) => {
    const user = await User.findByPk(req.body.id);
    if (!user) {
        throw { status: 404, message: "User not found" };
    }

    if (req.body.password) {
        req.body.password = await hash(req.body.password, 10);
    }

    await user.update(req.body);
    return user;
}

export const activeUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw { status: 404, message: "User not found" };
    }

    user.isActive = true; // Set user as active
    await user.save();
    return user;
}

export const deactiveUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw { status: 404, message: "User not found" };
    }

    user.isActive = false; // Set user as inactive
    await user.save();
    return user;
}

export const deleteUser = async (id) => {

    const user = await User.findByPk(id,{
        include: [
            { model: Invoice, as: "createdByUsers" },
            { model: Invoice, as: "updatedByUsers" }
        ],
    });

    if (!user) {
        throw { status: 404, message: "User not found" };
    }

     if (
        (user.createdByUsers && user.createdByUsers.length > 0) ||
        (user.updatedByUsers && user.updatedByUsers.length > 0)
    ) {
        throw { status: 400, message: "Can't delete, User has related Invoices" };
    }

    await user.destroy();
    return user;
}