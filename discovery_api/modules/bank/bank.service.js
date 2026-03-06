import { Bank, Stock, Payment } from "../../models/model.js";

export const getAllBank = async () => {
    const data = await Bank.findAll();
    if (!data || data.length === 0) throw { status: 400, message: "No Bank found" };
    return data;
}

export const getBalanceStatement = async () => {
  const data = await Bank.findAll({
    include: [
      { model: Stock, as: "stocks" },
      { model: Payment, as: "payments" },
    ],
  });

  if (!data || data.length === 0) throw { status: 400, message: "No Bank found" };

  const bankData = data.map(bank => {
    // --- Stock totals ---
    const { stockInSum, stockOutSum } =
      bank.stocks?.reduce(
        (acc, stock) => {
          const qty = Number(stock.quantity) || 0;
          if (stock.movementType === "stock_in") acc.stockInSum += qty;
          else if (stock.movementType === "stock_out") acc.stockOutSum += qty;
          return acc;
        },
        { stockInSum: 0, stockOutSum: 0 }
      ) ?? { stockInSum: 0, stockOutSum: 0 };

    // --- Payment totals ---
    let paymentInSum = 0;
    let paymentOutSum = 0;
    let expenseOutSum = 0;
    let advanceInSum = 0;
    let advanceOutSum = 0;
    let capitalInSum = 0;
    let capitalOutSum = 0;
    let containerExpenseOutSum = 0;
    let billOutSum = 0;

    bank.payments?.forEach(payment => {
      const amount = Number(payment.amountPaid) || 0;

      switch (payment.paymentType) {
        case "payment_in":
          paymentInSum += amount;
          break;
        case "deposit":
          paymentInSum += amount;
          break;
        case "premium_received":
          paymentInSum += amount;
          break;
        case "payment_out":
          paymentOutSum += amount;
          break;
        case "withdraw":
          paymentOutSum += amount;
          break;
        case "premium_paid":
          paymentOutSum += amount;
          break;
        case "advance_received":
          advanceInSum += amount;
          break;
        case "advance_payment_deduct":
          advanceInSum += amount;
          break;
        case "advance_payment":
          advanceOutSum += amount;
          break;
        case "advance_received_deduct":
          advanceOutSum += amount;
          break;
        case "capital_in":
          capitalInSum += amount;
          break;
        case "capital_out":
          capitalOutSum += amount;
          break;
        case "office_expense":
          expenseOutSum += amount;
          break;
        case "container_expense":
          containerExpenseOutSum += amount;
          break;
        case "bill_out":
          billOutSum += amount;
          break;
      }
    });

    return {
      stockInSum,
      stockOutSum,
      paymentInSum,
      paymentOutSum,
      advanceInSum,
      advanceOutSum,
      capitalInSum,
      capitalOutSum,
      expenseOutSum,
      containerExpenseOutSum,
      billOutSum,
      ...bank.toJSON(),
    };
  });

  return bankData;
};


export const getAssetStatement = async () => {
  const data = await Bank.findAll({
    include: [
      { model: Payment, as: "payments" },
    ],
  });

  if (!data || data.length === 0) throw { status: 400, message: "No Bank found" };

  const bankData = data.map(bank => {
    let capitalInSum = 0;
    let capitalOutSum = 0;
    let expenseOutSum = 0;
    let containerExpenseOutSum = 0;

    bank.payments?.forEach(payment => {
      const amount = Number(payment.amountPaid) || 0;

      switch (payment.paymentType) {
        case "capital_in":
          capitalInSum += amount;
          break;
        case "capital_out":
          capitalOutSum += amount;
          break;
        case "office_expense":
          expenseOutSum += amount;
          break;
        case "container_expense":
          containerExpenseOutSum += amount;
          break;
      }
    });

    return {
      capitalInSum,
      capitalOutSum,
      expenseOutSum,
      containerExpenseOutSum,
      ...bank.toJSON(),
    };
  });

  return bankData;
};



export const createBank = async (req) => {
    const data = await Bank.create(req.body);
    return data;
}

export const getBankById = async (id) => {
    const data = await Bank.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Bank not found" };
    }
    return data;
}

export const updateBank = async (req) => {
    
  const bank = await Bank.findByPk(req.body.id);
  console.log("req.body: ", bank);
  if (!bank) {
      throw { status: 404, message: "Bank not found" };
  }

  await bank.update(req.body);
  return bank;
}

export const activeBank = async (id) => {
    const data = await Bank.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Bank not found" };
    }

    data.isActive = true;

    await data.save();
    return data;
}

export const deactiveBank = async (id) => {
    const data = await Bank.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Bank not found" };
    }

    data.isActive = false;

    await data.save();
    return data;
}

export const deleteBank = async (id) => {
  try{    
    const data = await Bank.findByPk(id,{
      include: [
        { model: Stock, as: "stocks" },
        { model: Payment, as: "payments" },
      ],
    });

    if (!data) {
      throw new Error("Bank not found");
    }

    if (data.payments.length > 0 || data.stocks.length > 0) {
      throw new Error("Can't delete, account has reference of Payment/Stock");
    }

    data.destroy();

    return data;
  } catch (error) {
    throw error;
  }
}