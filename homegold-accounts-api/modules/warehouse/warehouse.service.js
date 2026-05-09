import { Warehouse } from "../../models/model.js";

export const getAllWarehouse = async () => {
    const data = await Warehouse.findAll();
    if (!data || data.length === 0) throw { status: 400, message: "No Warehouse found" };
    return data;
}

export const createWarehouse = async (req) => {
    const data = await Warehouse.create(req.body);
    console.log("Warehouse response body:", data);
    
    return data;
}

export const getWarehouseById = async (id) => {
    const data = await Warehouse.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Warehouse not found" };
    }
    return data;
}

export const updateWarehouse = async (req) => {
    const data = await Warehouse.findByPk(req.body.id);
    console.log("Warehouse: ", data);
    if (!data) {
        throw { status: 404, message: "Warehouse not found" };
    }

    await data.update(req.body);
    return data;
}

export const activeWarehouse = async (id) => {
    const data = await Warehouse.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Warehouse not found" };
    }

    data.isActive = true;

    await data.save();
    return data;
}

export const deactiveWarehouse = async (id) => {
    const data = await Warehouse.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Warehouse not found" };
    }

    data.isActive = false;

    await data.save();
    return data;
}

export const deleteWarehouse = async (id) => {
      
    const data = await Warehouse.findByPk(id);
    if (!data) {
      throw new Error("Warehouse not found");
    }

    data.destroy();

    return data;
}