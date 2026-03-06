import { StatusType } from "../../models/model.js";

export const getAllStatus = async () => {
  const data = await StatusType.findAll({
    order: [
      ['group', 'ASC'],   // order by group ascending
      ['name', 'ASC'],    // (optional) order by name ascending within group
    ],
  });

  if (!data || data.length === 0) {
    throw { status: 400, message: "No Status found" };
  }

  return data;
};


export const createStatus = async (req) => {
    const data = await StatusType.create(req.body);
    return data;
}

export const getStatusById = async (id) => {
    const data = await StatusType.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Status not found" };
    }
    return data;
}

export const updateStatus = async (req) => {
    const data = await StatusType.findByPk(req.body.id);
    if (!data) {
        throw { status: 404, message: "Status not found" };
    }

    await data.update(req.body);
    return data;
}

export const activeStatus = async (id) => {
    const data = await StatusType.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Status not found" };
    }

    data.isActive = true; // Set Status as active
    await data.save();
    return data;
}

export const deactiveStatus = async (id) => {
    const data = await StatusType.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Status not found" };
    }

    data.isActive = false; // Set Status as inactive
    await data.save();
    return data;
}

export const deleteStatus = async (id) => {
    const data = await StatusType.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Status not found" };
    }
    await data.destroy(); 
    return data;
}