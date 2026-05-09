import { Unit } from "../../models/model.js";

export const getAllUnit = async () => {
    const data = await Unit.findAll({
        order: [
        ['name', 'ASC'],    // (optional) order by name ascending within group
        ],
    });
    if (!data || data.length === 0) throw { status: 400, message: "No Unit found" };
    return data;
}

export const createUnit = async (req) => {
    const data = await Unit.create(req.body);
    console.log("Unit response body:", data);
    
    return data;
}

export const getUnitById = async (id) => {
    const data = await Unit.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Unit not found" };
    }
    return data;
}

export const updateUnit = async (req) => {
    const data = await Unit.findByPk(req.body.id);
    console.log("Unit: ", data);
    if (!data) {
        throw { status: 404, message: "Unit not found" };
    }

    await data.update(req.body);
    return data;
}

export const activeUnit = async (id) => {
    const data = await Unit.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Unit not found" };
    }

    data.isActive = true; // Set Unit as active
    await data.save();
    return data;
}

export const deactiveUnit = async (id) => {
    const data = await Unit.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Unit not found" };
    }

    data.isActive = false; // Set Unit as inactive
    await data.save();
    return data;
}