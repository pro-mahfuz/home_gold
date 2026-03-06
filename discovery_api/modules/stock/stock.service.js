import invoice from "../../models/invoice.js";
import { Stock, Business, User, Invoice, Item, Bank, Category, Container, Ledger, Warehouse, sequelize } from "../../models/model.js";
import { fn, col, literal } from "sequelize";


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
    ],
    group: ["containerId", "itemId", "unit"],
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
    };
  });
};

export const createStock = async (req) => {
  

  const t = await sequelize.transaction();

  try {
    const prefixMap = {
      stock_in: "STI",
      stock_out: "STO",
      damaged: "STA",
    };

    const prefix = prefixMap[req.body.movementType] || "";
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
    const data = await Stock.findByPk(id);
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