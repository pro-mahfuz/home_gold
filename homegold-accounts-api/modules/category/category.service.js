
import { Category, Item } from "../../models/model.js";

export const getAllCategory = async () => {
  const data = await Category.findAll({
    include: [
      {
        model: Item,
        as: "items",
      },
    ],
    order: [
      ["name", "ASC"], // 👈 order categories alphabetically
      [{ model: Item, as: "items" }, "name", "ASC"], // 👈 order items alphabetically within each category
    ],
  });

  if (!data || data.length === 0) {
    throw { status: 400, message: "No Categories found" };
  }

  return data;
};


export const createCategory = async (req) => {
    const data = await Category.create(req.body);
    console.log("Category response body:", data);
    
    return data;
}

export const getCategoryById = async (id) => {
    const data = await Category.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Category not found" };
    }
    return data;
}

export const updateCategory = async (req) => {
    const data = await Category.findByPk(req.body.id);
    console.log("Category: ", data);
    if (!data) {
        throw { status: 404, message: "Category not found" };
    }

    await data.update(req.body);
    return data;
}

export const activeCategory = async (id) => {
    const data = await Category.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Category not found" };
    }

    data.isActive = true; // Set Category as active
    await data.save();
    return data;
}

export const deactiveCategory = async (id) => {
    const data = await Category.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Category not found" };
    }

    data.isActive = false; // Set Category as inactive
    await data.save();
    return data;
}