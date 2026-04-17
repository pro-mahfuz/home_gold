import { Stock, Business, User, Invoice, Item, Bank, Category, Container, Ledger, Warehouse, Party, sequelize } from "../../models/model.js";
import { fn, literal } from "sequelize";

const STOCK_PREFIX_MAP = {
  stock_in: "STI",
  stock_out: "STO",
  damaged: "STA",
};
const TRANSFER_INVOICE_TYPE = "stock_transfer";
const STOCK_LEDGER_CATEGORY_NAMES = ["currency", "gold"];

const normalizeContainerId = (containerId) => {
  if (containerId === null || containerId === undefined || containerId === "") {
    return null;
  }

  const normalizedValue = Number(containerId);
  return Number.isNaN(normalizedValue) ? null : normalizedValue;
};

const getWarehouseAvailableStock = async ({
  businessId,
  itemId,
  unit,
  warehouseId,
  containerId,
  transaction,
}) => {
  const where = {
    businessId,
    itemId,
    unit,
    warehouseId,
    containerId: normalizeContainerId(containerId),
  };

  const [summary] = await Stock.findAll({
    attributes: [
      [fn("SUM", literal(`CASE WHEN movementType = 'stock_in' THEN quantity ELSE 0 END`)), "totalIn"],
      [fn("SUM", literal(`CASE WHEN movementType = 'stock_out' THEN quantity ELSE 0 END`)), "totalOut"],
      [fn("SUM", literal(`CASE WHEN movementType = 'damaged' THEN quantity ELSE 0 END`)), "totalDamaged"],
    ],
    where,
    raw: true,
    transaction,
  });

  const totalIn = Number(summary?.totalIn) || 0;
  const totalOut = Number(summary?.totalOut) || 0;
  const totalDamaged = Number(summary?.totalDamaged) || 0;

  return {
    totalIn,
    totalOut,
    totalDamaged,
    availableQty: totalIn - totalOut - totalDamaged,
  };
};


export const getAllStock = async () => {
    const data = await Stock.findAll({
        include: [
            {
                model: Business,
                as: "business",
            },
            {
                model: Invoice,
                as: "invoice",
            },
            {
                model: Item,
                as: "item",
            },
            {
                model: Bank,
                as: "bank",
            },
            {
                model: Container,
                as: "container",
            },
            {
                model: Warehouse,
                as: "warehouse",
            },
            {
                model: Party,
                as: "party",
            },
            {
                model: User,
                as: "createdByUser",
            },
            {
                model: User,
                as: "updatedByUser",
            },
        ],
        order: [
            ["date", "DESC"],
        ]
    });
    if (!data || data.length === 0) throw { status: 400, message: "No stock found" };

    const stockData = data.map((stock) => {
        let invoiceRefNo = '';
        let stockRefNo = '';
        invoiceRefNo = stock.invoice ? stock.invoice.prefix + "-" + String(stock.invoice.id).padStart(6, '0') : '';
        stockRefNo = stock.prefix + "-" + String(stock.id).padStart(6, '0');
        return {
            ...stock.toJSON(),
            invoiceRefNo,
            stockRefNo,
            createdByUser: stock.createdByUser?.name ?? null,
            updatedByUser: stock.updatedByUser?.name ?? null,
        };
    });

    return stockData;
}

export const getStockReport = async () => {
  const data = await Stock.findAll({
    attributes: [
      "warehouseId",
      "containerId",
      "itemId",
      "unit",

      // Sum quantity where movementType = 'in'
      [
        fn(
          "SUM",
          literal(`CASE WHEN movementType = 'stock_in' THEN quantity ELSE 0 END`)
        ),
        "totalIn",
      ],

      // Sum quantity where movementType = 'out'
      [
        fn(
          "SUM",
          literal(`CASE WHEN movementType = 'stock_out' THEN quantity ELSE 0 END`)
        ),
        "totalOut",
      ],

      // Sum quantity where movementType = 'damaged'
      [
        fn(
          "SUM",
          literal(`CASE WHEN movementType = 'damaged' THEN quantity ELSE 0 END`)
        ),
        "totalDamaged",
      ],
    ],
    include: [
      {
        model: Item,
        as: "item",
      },
      { model: Container, as: "container" },
      { model: Warehouse, as: "warehouse" },
    ],
    group: ["warehouseId", "containerId", "itemId", "unit"],
  });

  if (!data || data.length === 0) {
    throw { status: 400, message: "No stock found" };
  }

  return data.map((d) => {
    const json = d.toJSON();
    return {
      ...json,
      totalIn: Number(json.totalIn),
      totalOut: Number(json.totalOut),
      totalDamaged: Number(json.totalDamaged),
      availableQty: Number(json.totalIn) - Number(json.totalOut) - Number(json.totalDamaged),
    };
  });
};

export const getOverallStockReport = async () => {
  const details = await getStockReport();

  const summary = details.reduce(
    (acc, row) => {
      acc.totalIn += Number(row.totalIn) || 0;
      acc.totalOut += Number(row.totalOut) || 0;
      acc.totalDamaged += Number(row.totalDamaged) || 0;
      acc.totalAvailable += Number(row.availableQty) || 0;
      return acc;
    },
    {
      totalItems: details.length,
      totalIn: 0,
      totalOut: 0,
      totalDamaged: 0,
      totalAvailable: 0,
    }
  );

  return {
    summary,
    details,
  };
};

export const createStockTransfer = async (req) => {
  const t = await sequelize.transaction();

  try {
    const {
      businessId,
      date,
      categoryId,
      itemId,
      containerId = null,
      unit,
      quantity,
      fromWarehouseId,
      toWarehouseId,
      partyId = null,
      createdBy = null,
      updatedBy = null,
    } = req.body;

    const normalizedQty = Number(quantity) || 0;
    const normalizedFromWarehouseId = Number(fromWarehouseId) || 0;
    const normalizedToWarehouseId = Number(toWarehouseId) || 0;
    const normalizedPartyId = Number(partyId) > 0 ? Number(partyId) : null;
    const normalizedCategoryId = Number(categoryId) > 0 ? Number(categoryId) : null;
    const normalizedBusinessId = Number(businessId) || 0;

    if (normalizedQty <= 0) {
      throw { status: 400, message: "Transfer quantity must be greater than zero." };
    }

    if (!normalizedFromWarehouseId || !normalizedToWarehouseId) {
      throw { status: 400, message: "Both source and destination warehouses are required." };
    }

    if (normalizedFromWarehouseId === normalizedToWarehouseId) {
      throw { status: 400, message: "Source and destination warehouses cannot be the same." };
    }

    const normalizedItemId = Number(itemId) || 0;
    if (!normalizedItemId) {
      throw { status: 400, message: "Item is required for stock transfer." };
    }

    if (!unit) {
      throw { status: 400, message: "Unit is required for stock transfer." };
    }

    const [item, fromWarehouse, toWarehouse, category, party] = await Promise.all([
      Item.findByPk(normalizedItemId, { transaction: t }),
      Warehouse.findByPk(normalizedFromWarehouseId, { transaction: t }),
      Warehouse.findByPk(normalizedToWarehouseId, { transaction: t }),
      normalizedCategoryId ? Category.findByPk(normalizedCategoryId, { transaction: t }) : Promise.resolve(null),
      normalizedPartyId ? Party.findByPk(normalizedPartyId, { transaction: t }) : Promise.resolve(null),
    ]);

    if (!item) {
      throw { status: 404, message: "Item not found." };
    }
    if (!fromWarehouse) {
      throw { status: 404, message: "Source warehouse not found." };
    }
    if (!toWarehouse) {
      throw { status: 404, message: "Destination warehouse not found." };
    }

    const sourceSummary = await getWarehouseAvailableStock({
      businessId: normalizedBusinessId,
      itemId: normalizedItemId,
      unit,
      warehouseId: normalizedFromWarehouseId,
      containerId,
      transaction: t,
    });

    if (sourceSummary.availableQty < normalizedQty) {
      throw {
        status: 400,
        message: `Insufficient stock in source warehouse. Available: ${sourceSummary.availableQty.toFixed(2)} ${unit}`,
      };
    }

    const commonPayload = {
      businessId: normalizedBusinessId,
      date,
      invoiceType: TRANSFER_INVOICE_TYPE,
      invoiceId: null,
      partyId: normalizedPartyId,
      categoryId: normalizedCategoryId,
      itemId: normalizedItemId,
      containerId: normalizeContainerId(containerId),
      bankId: null,
      quantity: normalizedQty,
      unit,
      createdBy,
      updatedBy,
    };

    const stockOut = await Stock.create(
      {
        ...commonPayload,
        prefix: STOCK_PREFIX_MAP.stock_out,
        movementType: "stock_out",
        warehouseId: normalizedFromWarehouseId,
      },
      { transaction: t }
    );

    const stockIn = await Stock.create(
      {
        ...commonPayload,
        prefix: STOCK_PREFIX_MAP.stock_in,
        movementType: "stock_in",
        warehouseId: normalizedToWarehouseId,
      },
      { transaction: t }
    );

    if (category && STOCK_LEDGER_CATEGORY_NAMES.includes(category.name.toLowerCase())) {
      const toWhom = party?.name ?? "N/A";
      await Ledger.bulkCreate(
        [
          {
            businessId: normalizedBusinessId,
            categoryId: normalizedCategoryId,
            transactionType: "stock_out",
            partyId: normalizedPartyId,
            date,
            invoiceId: null,
            stockId: stockOut.id,
            description: `Transfer to ${toWhom} | ${fromWarehouse.name} -> ${toWarehouse.name}`,
            currency: null,
            stockCurrency: item.name,
            debitQty: 0,
            creditQty: normalizedQty,
            createdBy,
            updatedBy,
          },
          {
            businessId: normalizedBusinessId,
            categoryId: normalizedCategoryId,
            transactionType: "stock_in",
            partyId: normalizedPartyId,
            date,
            invoiceId: null,
            stockId: stockIn.id,
            description: `Transfer to ${toWhom} | ${fromWarehouse.name} -> ${toWarehouse.name}`,
            currency: null,
            stockCurrency: item.name,
            debitQty: normalizedQty,
            creditQty: 0,
            createdBy,
            updatedBy,
          },
        ],
        { transaction: t }
      );
    }

    await t.commit();

    return {
      transferOutId: stockOut.id,
      transferInId: stockIn.id,
      itemId: normalizedItemId,
      itemName: item.name,
      containerId: normalizeContainerId(containerId),
      fromWarehouseId: normalizedFromWarehouseId,
      fromWarehouseName: fromWarehouse.name,
      toWarehouseId: normalizedToWarehouseId,
      toWarehouseName: toWarehouse.name,
      toWhomPartyId: normalizedPartyId,
      toWhom: party?.name ?? null,
      quantity: normalizedQty,
      unit,
      availableBeforeTransfer: sourceSummary.availableQty,
      availableAfterTransfer: sourceSummary.availableQty - normalizedQty,
    };
  } catch (err) {
    if (!t.finished) await t.rollback();
    throw err;
  }
};

export const createStock = async (req) => {
  

  const t = await sequelize.transaction();

  try {
    const prefix = STOCK_PREFIX_MAP[req.body.movementType] || "";
    req.body.prefix = prefix;

    if (!req.body.partyId) {
      req.body.partyId = null;
    }

    const data = await Stock.create(req.body, { transaction: t });

    let debitQty = 0;
    let creditQty = 0;
    if (req.body.movementType === 'stock_out' || req.body.movementType === 'damaged') {
      creditQty = req.body.quantity;
    } else if (req.body.movementType === 'stock_in') {
      debitQty = req.body.quantity;
    }

    const item = await Item.findByPk(req.body.itemId);
    if (!item) throw { status: 400, message: "Item not found" };

    const category = await Category.findByPk(req.body.categoryId);
    // if (!category) throw { status: 400, message: "Category not found" };

    if (category && ["currency", "gold"].includes(category.name.toLowerCase())) {
      await Ledger.create({
        businessId: req.body.businessId,
        categoryId: category ? category.id : req.body.categoryId,
        invoiceId: req.body.invoiceId,
        transactionType: req.body.movementType,
        partyId: req.body.partyId,
        bankId: req.body.bankId,
        date: req.body.date,
        stockId: data.id,
        debitQty: debitQty,
        creditQty: creditQty,
        currency: null,
        stockCurrency: item.name,
        createdBy: req.body.createdBy
      }, { transaction: t });
    }

    await t.commit();
      
    return data;

  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export const getStockById = async (id) => {
    const data = await Stock.findByPk(id, {
      include: [
        { model: Item, as: "item" },
        { model: Container, as: "container" },
        { model: Warehouse, as: "warehouse" },
        { model: Party, as: "party" },
      ],
    });
    if (!data) {
        throw { status: 404, message: "Stock not found" };
    }
    return data;
}

export const updateStock = async (req) => {
  const t = await sequelize.transaction();

  try {
    // Find the stock by ID
    const stock = await Stock.findByPk(req.body.id, { transaction: t });
    if (!stock) {
      throw { status: 404, message: "Stock not found" };
    }

    if (!req.body.partyId) {
      req.body.partyId = null;
    }

    // Update stock with request body data
    await stock.update(req.body, { transaction: t });

    // Calculate debit and credit quantities based on movementType
    let debitQty = 0;
    let creditQty = 0;
    if (req.body.movementType === 'stock_out') {
      creditQty = req.body.quantity;
    } else if (req.body.movementType === 'stock_in') {
      debitQty = req.body.quantity;
    }

    // Find related item
    const item = await Item.findByPk(req.body.itemId, { transaction: t });
    if (!item) {
      throw { status: 404, message: "Item not found" };
    }

    
    const category = await Category.findByPk(req.body.categoryId);
    // Update the ledger instance
    if (category && ["currency", "gold"].includes(category.name.toLowerCase())) {
      // Find ledger entry related to this stock
      const ledger = await Ledger.findOne({
        where: { stockId: req.body.id },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!ledger) {
        await ledger.create({
          businessId: req.body.businessId,
          categoryId: category ? category.id : req.body.categoryId,
          invoiceId: req.body.invoiceId,
          transactionType: req.body.movementType,
          partyId: req.body.partyId,
          bankId: req.body.bankId,
          date: req.body.date,
          stockId: stock.id,
          debitQty,
          creditQty,
          currency: null,
          stockCurrency: item.name,
          updatedBy: req.body.updatedBy
        }, { transaction: t });
      } else {
        await ledger.update({
          businessId: req.body.businessId,
          categoryId: category ? category.id : req.body.categoryId,
          invoiceId: req.body.invoiceId,
          transactionType: req.body.movementType,
          partyId: req.body.partyId,
          bankId: req.body.bankId,
          date: req.body.date,
          stockId: stock.id,
          debitQty,
          creditQty,
          currency: null,
          stockCurrency: item.name,
          updatedBy: req.body.updatedBy
        }, { transaction: t });
      }
    }

    // Commit transaction
    await t.commit();

    return stock;

  } catch (error) {
    // Rollback on error
    await t.rollback();
    throw error;
  }
};


export const deleteStock = async (id) => {

  const t = await sequelize.transaction();

  const stock = await Stock.findByPk(id);
  if (!stock) {
    throw new Error("Stock not found");
  }

  try {
    const ledger = await Ledger.findOne({
      where: { stockId: stock.id },
      transaction: t,
    });

    if (ledger) {
      await ledger.destroy({ transaction: t });
    }

    await stock.destroy({ transaction: t });

    await t.commit();
    return { success: true, message: "Stock and ledger deleted successfully" };

  } catch (err) {
    if (!t.finished) await t.rollback();
    throw err;
  }
}
