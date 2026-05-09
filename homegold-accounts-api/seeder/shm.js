import { hash } from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import { Business, Role, User, Bank, StatusType, Unit, Warehouse, Category, Item } from "../models/model.js"; // Adjust the path as needed
import { faker } from '@faker-js/faker';

export async function shmSeed(permissions) {
  

  { /* SHM Gold */ }
  
  // Business
  const [SHMGold] = await Promise.all([
    Business.create({
      businessName: "SHM Gold & Jewellery",
      businessLicenseNo: "",
      ownerName: "Mr. Abdul Hoque",
      email: "mollahin3@gmail.com",
      countryCode: "AE",
      phoneCode: "+971",
      phoneNumber: "569969296",
      address: "Deira Dubai",
      city: "Dubai",
      country: "UAE",
      postalCode: "00000",
      isActive: true,
    }),
  ]);

  // Status
  await StatusType.bulkCreate([
    { businessId: SHMGold.id, group: "invoice", name: "Purchase", value: "purchase", isActive: true },
    { businessId: SHMGold.id, group: "invoice", name: "Purchase-Return", value: "purchase_return", isActive: true },
    { businessId: SHMGold.id, group: "invoice", name: "Sale", value: "sale", isActive: true },
    { businessId: SHMGold.id, group: "invoice", name: "Sale-Return", value: "sale_return", isActive: true },

    { businessId: SHMGold.id, group: "purchase", name: "Purchase", value: "purchase", isActive: true },
    // { businessId: SHMGold.id, group: "purchase", name: "Wholesale Purchase", value: "wholesale_purchase", isActive: true },
    // { businessId: SHMGold.id, group: "purchase", name: "Fix Purchase", value: "fix_purchase", isActive: true },
    // { businessId: SHMGold.id, group: "purchase", name: "Unfix Purchase", value: "unfix_purchase", isActive: true },

    { businessId: SHMGold.id, group: "sale", name: "Sale", value: "sale", isActive: true },
    // { businessId: SHMGold.id, group: "sale", name: "Wholesale Sale", value: "wholesale_sale", isActive: true },
    // { businessId: SHMGold.id, group: "sale", name: "Fix Sale", value: "fix_sale", isActive: true },
    // { businessId: SHMGold.id, group: "sale", name: "Unfix Sale", value: "unfix_sale", isActive: true },

    { businessId: SHMGold.id, group: "expense", name: "Expense-Office", value: "expense_office", isActive: true },
  ]);
  

  // Unit
  await Unit.bulkCreate([
    { businessId: SHMGold.id, name: "Currency", isActive: true }
  ]);

  // Role
  const [root, admin, manager, sale] = await Promise.all([
    Role.create({ businessId: SHMGold.id, name: "Root", action: "root", isActive: true }),
    Role.create({ businessId: SHMGold.id, name: "Admin", action: "admin", isActive: true }),
    Role.create({ businessId: SHMGold.id, name: "Manager", action: "manager", isActive: true }),
    Role.create({ businessId: SHMGold.id, name: "Sale Person", action: "sale", isActive: true }),
  ]);

  // Category
  const [Currency, Gold] = await Promise.all([
     Category.create({
      businessId: SHMGold.id,
      name: "Currency",
      isActive: true,
    }),
     Category.create({
      businessId: SHMGold.id,
      name: "Gold",
      isActive: true,
    })
  ]);

  // Item
  await Item.bulkCreate([
    {
      businessId: SHMGold.id,
      code: "001",
      name: "AED",
      categoryId: Currency.id,
      isActive: true,
    },
    {
      businessId: SHMGold.id,
      code: "002",
      name: "BDT",
      categoryId: Currency.id,
      isActive: true,
    },
    {
      businessId: SHMGold.id,
      code: "003",
      name: "USD",
      categoryId: Currency.id,
      isActive: true,
    }
  ]);

  // Warehouse
  await Warehouse.bulkCreate([
    {
      businessId: SHMGold.id,
      name: "SHM Store",
      details: "SHM store",
      location: "SHM store",
      isActive: true,
    }
  ]);

  // Account
  await Bank.bulkCreate([
    {
      businessId: SHMGold.id,
      accountName: "DS: Cash In Hand",
      accountNo: "ds-cash-in-hand",
      address: "",
      isActive: true,
    },
    {
      businessId: SHMGold.id,
      accountName: "BD: Cash In Hand",
      accountNo: "bdcash-in-hand",
      address: "",
      isActive: true,
    },
  ]);

  // User
  const [Mahfuz, Admin] = await Promise.all([
    User.create({
      businessId: SHMGold.id,
      roleId: root.id,
      name: "Root Admin",
      email: "root@gmail.com",
      password: await hash("password123", 10),
      isActive: true,
    }),
    User.create({
      businessId: SHMGold.id,
      roleId: admin.id,
      name: "Admin",
      email: "mollahin3@gmail.com",
      password: await hash("mollahin3@", 10),
      isActive: true,
    })
  ]);

  // Other User
  await User.bulkCreate([
    {
      businessId: SHMGold.id,
      roleId: manager.id,
      name: "Shahin",
      email: "akash.cnpp@gmail.com",
      password: await hash("shahin@123456", 10),
      isActive: true,
    },
    {
      businessId: SHMGold.id,
      roleId: sale.id,
      name: "Reton",
      email: "razaul1975@gmail.com",
      password: await hash("reton@789", 10),
      isActive: true,
    },
    {
      businessId: SHMGold.id,
      roleId: sale.id,
      name: "Anik",
      email: "anik.khan.lion25@gmail.com",
      password: await hash("anik@456", 10),
      isActive: true,
    },
    {
      businessId: SHMGold.id,
      roleId: sale.id,
      name: "Rajiv",
      email: "rajivekhan85@gmail.com",
      password: await hash("Rajiv@765", 10),
      isActive: true,
    },
    {
      businessId: SHMGold.id,
      roleId: sale.id,
      name: "Faruki",
      email: "mofsa91.uae@gmail.com",
      password: await hash("faruki@345", 10),
      isActive: true,
    },
    {
      businessId: SHMGold.id,
      roleId: sale.id,
      name: "Shamiul",
      email: "shamiulhawk@yahoo.com",
      password: await hash("shamiul@678", 10),
      isActive: true,
    },
    {
      businessId: SHMGold.id,
      roleId: sale.id,
      name: "Sadia",
      email: "sadiahaque1812@gmail.com",
      password: await hash("sadia@797", 10),
      isActive: true,
    },
    {
      businessId: SHMGold.id,
      roleId: sale.id,
      name: "Afridi",
      email: "afridimostaque@gmail.com",
      password: await hash("afridi@6677", 10),
      isActive: true,
    },
  ]);

  // Assign role to user
  await Mahfuz.setRole(root); 
  await Admin.setRole(admin);

  // Assign permission to user
  await root.setPermissions(permissions);
  await admin.setPermissions(permissions);

}
