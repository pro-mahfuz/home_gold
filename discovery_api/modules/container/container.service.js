
import { Container, Item, Stock } from "../../models/model.js";

export const getAllContainer = async () => {
    const data = await Container.findAll({
        include: [
            {
                model: Stock,
                as: "stocks",
            },
        ],
    });
    
    if (!data || data.length === 0)
        throw { status: 400, message: "No Container found" };

    //Add net stock field for each container
    // const containersWithNetStock = data
    // .map(container => {
    //     let netStock = 0;
    //     // if(container.stock){
    //         const rawNetStock = container.stocks.reduce((total, stock) => {
    //         const quantity = Number(stock.quantity ?? 0);
    //         return stock.movementType === "in" | "saleReturen"
    //             ? total + quantity
    //             : total - quantity;
    //         }, 0);

    //         netStock = Number(rawNetStock % 1 === 0 ? rawNetStock.toFixed(0) : rawNetStock.toFixed(2));
    //     // }

    //     return {
    //         ...container.toJSON(),
    //         netStock: netStock.toString(), // or keep as a number if needed
    //     };
    // });
    
    return data;
}

export const createContainer = async (req) => {
    const data = await Container.create(req.body);
    return data;
}

export const getContainerById = async (id) => {
    const data = await Container.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Container not found" };
    }
    return data;
}

export const updateContainer = async (req) => {
    const data = await Container.findByPk(req.body.id);
    if (!data) {
        throw { status: 404, message: "Container not found" };
    }

    await data.update(req.body);
    return data;
}

export const activeContainer = async (id) => {
    const data = await Container.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Container not found" };
    }

    data.isActive = true; // Set Container as active
    await data.save();
    return data;
}

export const deactiveContainer = async (id) => {
    const data = await Container.findByPk(id);
    if (!data) {
        throw { status: 404, message: "Container not found" };
    }

    data.isActive = false; // Set Container as inactive
    await data.save();
    return data;
}