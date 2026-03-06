import { Item } from "../../models/model.js";

export const getAllItem = async () => {
    const data = await Item.findAll({
        include: ['category']
    });
    if (!data || data.length === 0) throw { status: 400, message: "No Categories found" };
    return data;
}

export const createItem = async (req) => {
    const data = await Item.create(req.body);
    console.log("Item response body:", data);
    
    return data;
}

export const getItemById = async (id) => {
    const data = await Item.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Item not found" };
    }
    return data;
}

export const updateItem = async (req) => {
    const data = await Item.findByPk(req.body.id);
    console.log("Item: ", data);
    if (!data) {
        throw { status: 404, message: "Item not found" };
    }

    await data.update(req.body);
    return data;
}

export const activeItem = async (id) => {
    const data = await Item.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Item not found" };
    }

    data.isActive = true; // Set Item as active
    await data.save();
    return data;
}

export const deactiveItem = async (id) => {
    const data = await Item.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Item not found" };
    }

    data.isActive = false; // Set Item as inactive
    await data.save();
    return data;
}