import { Router } from "express";

import { upload } from "../middleware/fileUpload.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";

import { businessSchema } from "../modules/business/business.validator.js";
import { userSchema } from "../modules/user/user.validator.js";
import { profileSchema } from "../modules/profile/profile.validator.js";
import { partySchema } from "../modules/party/party.validator.js";
import { categorySchema } from "../modules/category/category.validator.js";
import { statusTypeSchema } from "../modules/status/status.validator.js";
import { unitSchema } from "../modules/unit/unit.validator.js";
import { itemSchema } from "../modules/item/item.validator.js";
import { containerSchema } from "../modules/container/container.validator.js";
import { invoiceSchema } from "../modules/invoice/invoice.validator.js";
import { paymentSchema } from "../modules/payment/payment.validator.js";
import { stockSchema } from "../modules/stock/stock.validator.js";
import { warehouseSchema } from "../modules/warehouse/warehouse.validator.js";
import { bankSchema } from "../modules/bank/bank.validator.js";

import * as BusinessController from "../modules/business/business.controller.js";
import * as UserController from "../modules/user/user.controller.js";
import * as ProfileController from "../modules/profile/profile.controller.js";
import * as AuthController from "../modules/auth/auth.controller.js";
import * as RoleController from "../modules/role/role.controller.js";
import * as PermissionController from "../modules/permission/permission.controller.js";
import * as PartyController from "../modules/party/party.controller.js";
import * as CategoryController from "../modules/category/category.controller.js";
import * as StatusController from "../modules/status/status.controller.js";
import * as UnitController from "../modules/unit/unit.controller.js";
import * as ItemController from "../modules/item/item.controller.js";
import * as ContainerController from "../modules/container/container.controller.js";
import * as InvoiceController from "../modules/invoice/invoice.controller.js";
import * as PaymentController from "../modules/payment/payment.controller.js";
import * as StockController from "../modules/stock/stock.controller.js";
import * as WarehouseController from "../modules/warehouse/warehouse.controller.js";
import * as BankController from "../modules/bank/bank.controller.js";
import * as LedgerController from "../modules/ledger/ledger.controller.js";

const router = Router();

// Route accessible only by 'authorize' middleware to check if the user has permission
// This route uses the 
router.post("/logout", AuthController.logout);
router.post("/logoutAll", AuthController.logoutAll);

/*---Roles & Permissions---*/
router.get("/roles", authorize("manage_roles"), RoleController.getAllRoles);
router.post("/roles/:id/active", authorize("manage_roles"), RoleController.activeRole);
router.post("/roles/:id/deactive", authorize("manage_roles"), RoleController.deactiveRole);
router.post("/roles/:id/delete", authorize("manage_roles"), RoleController.deleteRole);

router.get("/permissions", authorize("manage_permissions"), PermissionController.getAllPermissions);
router.post("/set-permissions", authorize("manage_permissions"), PermissionController.setPermissionsForRole );
router.get("/get-permissions/:roleId", authorize("manage_permissions"), PermissionController.getPermissionsForRole );

/*---Business---*/
router.get("/business/list", authorize("manage_business"), BusinessController.getAllBusiness);
router.post("/business/create", authorize("create_business"), upload.fields([
    { name: 'businessLogo', maxCount: 1 },
    { name: 'businessLicenseCopy', maxCount: 1 }
  ]), validate(businessSchema), BusinessController.createBusiness);
router.get("/business/:id/view", authorize("view_business"), BusinessController.getBusinessById);
router.put("/business/update", authorize("edit_business"), upload.fields([
    { name: 'businessLogo', maxCount: 1 },
    { name: 'businessLicenseCopy', maxCount: 1 }
  ]), validate(businessSchema), BusinessController.updateBusiness);
router.post("/business/:id/active", authorize("manage_business"), BusinessController.activeBusiness);
router.post("/business/:id/deactive", authorize("manage_business"), BusinessController.deactiveBusiness);
router.post("/business/:id/delete", authorize("delete_business"), BusinessController.deleteBusiness);

/*---Profile---*/
router.post("/profile/:id", authorize("manage_profile"), upload.single('profilePicture'), validate(profileSchema), ProfileController.createProfile);
router.get("/profile/:id", authorize("view_profile"), ProfileController.getProfileById);
router.put("/profile/:id", authorize("edit_profile"), upload.single('profilePicture'), validate(profileSchema), ProfileController.updateProfileById);

/*---Users---*/
router.get("/user/list", authorize("manage_users"), UserController.getAllUser);
router.post("/user/create", authorize("create_users"), validate(userSchema), UserController.createUser);
router.get("/user/:id/view", authorize("view_users"), UserController.getUserById);
router.put("/user/update", authorize("edit_users"), validate(userSchema), UserController.updateUser);
router.post("/user/:id/active", authorize("manage_users"), UserController.activeUser);
router.post("/user/:id/deactive", authorize("manage_users"), UserController.deactiveUser);
router.post("/user/:id/delete", authorize("delete_users"), UserController.deleteUser);

/*---Party---*/
router.get("/party/list", authorize(["manage_party", "manage_supplier", "manage_customer"]), PartyController.getAllParty);
router.get("/party/list/paginated", authorize(["manage_party", "manage_supplier", "manage_customer"]), PartyController.getAllPartyPaginated);
router.get("/party/getReceivablePayable", PartyController.getReceivablePayable);
router.post("/party/create", authorize(["create_party", "create_supplier", "create_customer"]), validate(partySchema), PartyController.createParty);
router.get("/party/:id", authorize(["view_party", "view_supplier", "view_customer"]), PartyController.getPartyById);
router.put("/party/:id", authorize(["edit_party", "edit_supplier", "edit_customer"]), validate(partySchema), PartyController.updateParty);
router.post("/party/:id/active", authorize(["manage_party", "manage_supplier", "manage_customer"]), PartyController.activeParty);
router.post("/party/:id/deactive", authorize(["manage_party", "manage_supplier", "manage_customer"]), PartyController.deactiveParty);

/*---Category---*/
router.get("/category/list", CategoryController.getAllCategory);
router.post("/category/create", authorize("create_category"), validate(categorySchema), CategoryController.createCategory);
router.get("/category/:id", authorize("view_category"), CategoryController.getCategoryById);
router.put("/category/update", authorize("edit_category"), validate(categorySchema), CategoryController.updateCategory);
router.post("/category/:id/active", authorize("manage_category"), CategoryController.activeCategory);
router.post("/category/:id/deactive", authorize("manage_category"), CategoryController.deactiveCategory);

/*---Status---*/
router.get("/status/list", StatusController.getAllStatus);
router.post("/status/create", authorize("create_status"), validate(statusTypeSchema), StatusController.createStatus);
router.get("/status/:id", authorize("view_status"), StatusController.getStatusById);
router.put("/status/update", authorize("edit_status"), validate(statusTypeSchema), StatusController.updateStatus);
router.post("/status/:id/active", authorize("manage_status"), StatusController.activeStatus);
router.post("/status/:id/deactive", authorize("manage_status"), StatusController.deactiveStatus);
router.post("/status/:id/delete", authorize("delete_status"), StatusController.deleteStatus);

/*---Unit---*/
router.get("/unit/list", UnitController.getAllUnit);
router.post("/unit/create", authorize("create_unit"), validate(unitSchema), UnitController.createUnit);
router.get("/unit/:id", authorize("view_unit"), UnitController.getUnitById);
router.put("/unit/update", authorize("edit_unit"), validate(unitSchema), UnitController.updateUnit);
router.post("/unit/:id/active", authorize("manage_unit"), UnitController.activeUnit);
router.post("/unit/:id/deactive", authorize("manage_unit"), UnitController.deactiveUnit);

/*---Item---*/
router.get("/item/list", ItemController.getAllItem);
router.post("/item/create", authorize("create_item"), validate(itemSchema), ItemController.createItem);
router.get("/item/:id", authorize("view_item"), ItemController.getItemById);
router.put("/item/update", authorize("edit_item"), validate(itemSchema), ItemController.updateItem);
router.post("/item/:id/active", authorize("manage_item"), ItemController.activeItem);
router.post("/item/:id/deactive", authorize("manage_item"), ItemController.deactiveItem);

/*---Container---*/
router.get("/container/list", ContainerController.getAllContainer);
router.post("/container/create", authorize("create_container"), validate(containerSchema), ContainerController.createContainer);
router.get("/container/:id/view", authorize("view_container"), ContainerController.getContainerById);
router.put("/container/update", authorize("edit_container"), validate(containerSchema), ContainerController.updateContainer);
router.post("/container/:id/delete", authorize("delete_container"), ContainerController.deactiveContainer);

/*---Invoice---*/
router.get("/invoice/list", authorize(["manage_invoice", "manage_purchase", "manage_sale", "report_sale", "report_container_expense", "report_expense", "report_profit", "report_bill"]), InvoiceController.getAllInvoice);
router.post("/invoice/create", authorize(["create_invoice", "create_purchase", "create_sale", "create_bill"]), validate(invoiceSchema), InvoiceController.createInvoice);
router.get("/invoice/:id/view", authorize(["view_invoice", "view_purchase", "view_sale", "view_bill"]), InvoiceController.getInvoiceById);
router.put("/invoice/update", authorize(["edit_invoice", "edit_purchase", "edit_sale", "edit_bill"]), validate(invoiceSchema), InvoiceController.updateInvoice);
router.post("/invoice/:id/delete", authorize(["delete_invoice", "delete_purchase", "delete_sale", "delete_bill"]), InvoiceController.deleteInvoice);

/*---Payment---*/
router.get("/payment/list", authorize(["manage_payment", "manage_expense", "manage_payment_2", "report_payment", "report_payment_2"]), PaymentController.getAllPayment);
router.get("/payment/paginatedList", authorize(["manage_payment", "manage_expense", "manage_payment_2", "report_payment", "report_payment_2"]), PaymentController.getAllPaymentPaginated);
router.post("/payment/create", authorize(["create_payment", "create_expense", "create_payment_2"]), validate(paymentSchema), PaymentController.createPayment);
router.get("/payment/:id/view", authorize(["view_payment", "view_expense"]), PaymentController.getPaymentById);
router.put("/payment/update", authorize(["edit_payment", "edit_expense", "edit_payment_2"]), validate(paymentSchema), PaymentController.updatePayment);
router.post("/payment/:id/delete", authorize("delete_payment", "delete_expense", ), PaymentController.deletePayment);

/*---Warehouse---*/
router.get("/warehouse/list", WarehouseController.getAllWarehouse);
router.post("/warehouse/create", authorize("create_warehouse"), validate(warehouseSchema), WarehouseController.createWarehouse);
router.get("/warehouse/:id/view", authorize("view_warehouse"), WarehouseController.getWarehouseById);
router.put("/warehouse/update", authorize("edit_warehouse"), validate(warehouseSchema), WarehouseController.updateWarehouse);
router.post("/warehouse/:id/active", authorize("manage_warehouse"), WarehouseController.activeWarehouse);
router.post("/warehouse/:id/deactive", authorize("manage_warehouse"), WarehouseController.deactiveWarehouse);
router.post("/warehouse/:id/delete", authorize("delete_warehouse"), WarehouseController.deleteWarehouse);


/*---Bank---*/
router.get("/account/list", BankController.getAllBank);
router.post("/account/create", authorize("create_account"), validate(bankSchema), BankController.createBank);
router.get("/account/:id/view", authorize("view_account"), BankController.getBankById);
router.put("/account/update", authorize("edit_account"), validate(bankSchema), BankController.updateBank);
router.post("/account/:id/active", authorize("manage_account"), BankController.activeBank);
router.post("/account/:id/deactive", authorize("manage_account"), BankController.deactiveBank);
router.post("/account/:id/delete", authorize("delete_account"), BankController.deleteBank);

/*---Stock---*/
router.get("/stock/list", authorize(["manage_stock", "report_stock"]), StockController.getAllStock);
router.post("/stock/create", authorize("create_stock"), validate(stockSchema), StockController.createStock);
router.get("/stock/:id/view", authorize("view_stock"), StockController.getStockById);
router.put("/stock/update", authorize("edit_stock"), validate(stockSchema), StockController.updateStock);
router.post("/stock/:id/delete", authorize("delete_stock"), StockController.deleteStock);

/*---Currency ledger---*/
router.get("/ledger/list", authorize(["manage_ledger", "currency_ledger"]), LedgerController.getAllLedger);

/** Report */
router.post("/stock/getStockReport", authorize("report_stock"), StockController.getStockReport);
router.post("/invoice/getSaleReport", authorize(["report_sale", "report_sale_2"]), InvoiceController.getSaleReport);
router.post("/invoice/getPurchaseReport", authorize("report_purchase"), InvoiceController.getPurchaseReport);
router.post("/invoice/getSaleContainerReport", authorize("report_sale_container"), InvoiceController.getSaleContainerReport);
router.post("/invoice/getSaleCashReport", authorize("report_sale"), InvoiceController.getSaleCashReport);
router.post("/invoice/getBillReport", authorize("report_bill"), InvoiceController.getBillReport);
router.post("/invoice/getSalePaymentReport", authorize(["report_payment", "report_expense", "report_container_expense"]), InvoiceController.getSalePaymentReport);
router.post("/invoice/getProfitLossReport", authorize("report_profit"), InvoiceController.getProfitLossReport);
router.post("/invoice/getDailyProfitLossReport", authorize("report_daily_profit"), InvoiceController.getDailyProfitLossReport);
router.get("/report/balance/statement", BankController.getBalanceStatement);
router.get("/report/asset/statement", BankController.getAssetStatement);


export default router;