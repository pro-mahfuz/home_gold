import { GoldPriceIn, Business, User } from "../../models/model.js";

const buildBusinessScope = (req) => {
  if (req.user?.roleId === 1) {
    const requestedBusinessId = req.query?.businessId ?? req.body?.businessId;
    return requestedBusinessId ? { businessId: Number(requestedBusinessId) } : {};
  }

  return { businessId: req.user.businessId };
};

const buildPayload = (req, isUpdate = false) => {
  const source = req.validated ?? req.body;
  const payload = { ...source };

  payload.businessId =
    req.user?.roleId === 1
      ? Number(source.businessId ?? req.user.businessId)
      : req.user.businessId;

  if (isUpdate) {
    payload.updatedBy = req.user.id;
    delete payload.createdBy;
  } else {
    payload.createdBy = req.user.id;
    payload.updatedBy = req.user.id;
  }

  return payload;
};

export const getAllGoldPriceIn = async (req) => {
  const data = await GoldPriceIn.findAll({
    where: buildBusinessScope(req),
    include: [
      { model: Business, as: "business" },
      { model: User, as: "createdByUser", attributes: ["id", "name", "email"] },
      { model: User, as: "updatedByUser", attributes: ["id", "name", "email"] },
    ],
    order: [["createdAt", "DESC"]],
  });

  if (!data || data.length === 0) {
    throw { status: 404, message: "No gold price data found" };
  }

  return data;
};

export const getLatestGoldPriceIn = async (req) => {
  const data = await GoldPriceIn.findOne({
    where: buildBusinessScope(req),
    include: [
      { model: Business, as: "business" },
      { model: User, as: "createdByUser", attributes: ["id", "name", "email"] },
      { model: User, as: "updatedByUser", attributes: ["id", "name", "email"] },
    ],
    order: [["createdAt", "DESC"]],
  });

  if (!data) {
    throw { status: 404, message: "No gold price data found" };
  }

  return data;
};

export const createGoldPriceIn = async (req) => {
  const payload = buildPayload(req);
  return GoldPriceIn.create(payload);
};

export const getGoldPriceInById = async (req) => {
  const data = await GoldPriceIn.findOne({
    where: {
      id: Number(req.params.id),
      ...buildBusinessScope(req),
    },
    include: [
      { model: Business, as: "business" },
      { model: User, as: "createdByUser", attributes: ["id", "name", "email"] },
      { model: User, as: "updatedByUser", attributes: ["id", "name", "email"] },
    ],
  });

  if (!data) {
    throw { status: 404, message: "Gold price data not found" };
  }

  return data;
};

export const updateGoldPriceIn = async (req) => {
  const payload = buildPayload(req, true);

  if (!payload.id) {
    throw { status: 400, message: "ID is required" };
  }

  const data = await GoldPriceIn.findOne({
    where: {
      id: Number(payload.id),
      ...buildBusinessScope(req),
    },
  });

  if (!data) {
    throw { status: 404, message: "Gold price data not found" };
  }

  await data.update(payload);
  return data;
};

export const deleteGoldPriceIn = async (req) => {
  const data = await GoldPriceIn.findOne({
    where: {
      id: Number(req.params.id),
      ...buildBusinessScope(req),
    },
  });

  if (!data) {
    throw { status: 404, message: "Gold price data not found" };
  }

  await data.destroy();
  return data;
};
