import { hash } from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import { Business, Role, User, Container, Bank, StatusType, Unit, Warehouse, Category, Item } from "../models/model.js"; // Adjust the path as needed
import { faker } from '@faker-js/faker';

export async function discoverySeed(permissions) {

  { /* Discovery */ }

  // Business
  const [Discovery] = await Promise.all([
    Business.create({
      businessName: "Discovery Foodstuff Trading Co. LLC",
      businessLicenseNo: "",
      ownerName: "Mr. Aftab",
      email: "discoveryaftab@gmail.com",
      countryCode: "AE",
      phoneCode: "+971",
      phoneNumber: "557175842",
      address: "Ras Al Khor, Fruits And Vegitable Market, Building No: 10, Shop S1",
      city: "Dubai",
      country: "UAE",
      postalCode: "00000",
      isActive: true,
    })
  ]);

  // Status
  await StatusType.bulkCreate([
    { businessId: Discovery.id, group: "invoice", name: "Purchase", value: "purchase", isActive: true },
    { businessId: Discovery.id, group: "invoice", name: "Purchase-Return", value: "purchase_return", isActive: true },
    { businessId: Discovery.id, group: "invoice", name: "Sale", value: "sale", isActive: true },
    { businessId: Discovery.id, group: "invoice", name: "Sale-Return", value: "sale_return", isActive: true },

    { businessId: Discovery.id, group: "purchase", name: "Purchase", value: "purchase", isActive: true },

    { businessId: Discovery.id, group: "sale", name: "Wholesale Sale", value: "sale", isActive: true },

    { businessId: Discovery.id, group: "expense", name: "Expense-Office", value: "expense_office", isActive: true },
    { businessId: Discovery.id, group: "expense", name: "Expense-Container", value: "expense_container", isActive: true },
  ]);

  // Unit
  await Unit.bulkCreate([
    { businessId: Discovery.id, name: "2.5 Kg - Bag", isActive: true },
    { businessId: Discovery.id, name: "4 Kg - Box", isActive: true },
    { businessId: Discovery.id, name: "7 Kg - Box", isActive: true },
    { businessId: Discovery.id, name: "7 Kg - P.P Box", isActive: true },
    { businessId: Discovery.id, name: "8 Kg - Box", isActive: true }
  ]);
  
  // Role
  const [root, admin, manager, sale] = await Promise.all([
    Role.create({ businessId: Discovery.id, name: "Root", action: "root", isActive: true }),
    Role.create({ businessId: Discovery.id, name: "Admin", action: "admin", isActive: true }),
    Role.create({ businessId: Discovery.id, name: "Manager", action: "manager", isActive: true }),
    Role.create({ businessId: Discovery.id, name: "Sale Person", action: "sale", isActive: true }),
  ]);

  // Category
  const [Fruit, Vegetable] = await Promise.all([
    Category.create({
      businessId: Discovery.id,
      name: "Fruit",
      isActive: true,
    }),
    Category.create({
      businessId: Discovery.id,
      name: "Vegetable",
      isActive: true,
    })
  ]);

  // Item
  await Item.bulkCreate([
    {
      businessId: Discovery.id,
      categoryId: 1,
      code: "Orange",
      name: "Orange",
      isActive: true,
    },
    {
      businessId: Discovery.id,
      categoryId: 1,
      code: "Plum",
      name: "Plum",
      isActive: true,
    },
    {
      businessId: Discovery.id,
      categoryId: 2,
      code: "Carrot",
      name: "Carrot",
      isActive: true,
    },
    {
      businessId: Discovery.id,
      categoryId: 2,
      code: "Taro",
      name: "Taro",
      isActive: true,
    },
    {
      businessId: Discovery.id,
      categoryId: 2,
      code: "Radish",
      name: "Radish",
      isActive: true,
    },
    {
      businessId: Discovery.id,
      categoryId: 2,
      code: "Garlic P.W",
      name: "Garlic P.W",
      isActive: true,
    }
  ]);

  // Container
  await Container.bulkCreate([
    {
      businessId: Discovery.id,
      date: "2025-08-10",
      blNo: "BL256325",
      soNo: "SO325684",
      oceanVesselName: "TS KEELUNG",
      voyageNo: "",
      agentDetails: "T.S LINES (U.A.E) L.L.C",
      containerNo: "OTPU6602650/40RH",
      sealNo: "SL325688",
      isActive: true
    },
  ]);

  // Warehouse
  await Warehouse.bulkCreate([
    {
      businessId: Discovery.id,
      name: "Golam Ali Store",
      details: "Golam Ali Store",
      location: "",
      isActive: true,
    }
  ]);

  // Account
  await Bank.bulkCreate([
    {
      businessId: Discovery.id,
      accountName: "Cash In Hand",
      accountNo: "cash-in-hand",
      address: "",
      isActive: true,
    },
  ]);

  // User
  const [Mahfuz, Admin] = await Promise.all([
    User.create({
      businessId: Discovery.id,
      roleId: root.id,
      name: "Root Admin",
      email: "root@gmail.com",
      password: await hash("password123", 10),
      isActive: true,
    }),
    User.create({
      businessId: Discovery.id,
      roleId: admin.id,
      name: "Admin",
      email: "admin@gmail.com",
      password: await hash("password123", 10),
      isActive: true,
    })
  ]);

  // Assign role to user
  await Mahfuz.setRole(root); 
  await Admin.setRole(admin);

  // Assign permission to user
  await root.setPermissions(permissions);
  await admin.setPermissions(permissions);

}
