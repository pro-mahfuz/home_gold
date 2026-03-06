import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

//const sequelize = new Sequelize(process.env.DB_URI);
console.log(process.env.DB_NAME);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false
  }
);

// import your model here...
import defineStatusType from './statusType.js';
import defineBusiness from './business.js';
import defineUser from './user.js';
import defineProfile from './profile.js';
import defineRole from './role.js';
import definePermission from './permission.js';
import defineRolePermission from './rolePermission.js';
import defineTokenStore from './tokenStore.js';
import defineParty from './party.js';
import defineCategory from './category.js';
import defineUnit from './unit.js';
import defineItem from './item.js';
import defineContainer from './container.js';
import defineInvoice from './invoice.js';
import defineInvoiceItem from './invoiceItem.js';
import definePayment from './payment.js';
import defineLedger from './ledger.js';
import defineWarehouse from './warehouse.js';
import defineBank from './bank.js';
import defineStock from './stock.js';

// define your model here...
const StatusType = defineStatusType(sequelize, Sequelize.DataTypes);
const Business = defineBusiness(sequelize, Sequelize.DataTypes);
const Category = defineCategory(sequelize, Sequelize.DataTypes);
const Unit = defineUnit(sequelize, Sequelize.DataTypes);
const Item = defineItem(sequelize, Sequelize.DataTypes);
const Bank = defineBank(sequelize, Sequelize.DataTypes);
const Warehouse = defineWarehouse(sequelize, Sequelize.DataTypes);
const Container = defineContainer(sequelize, Sequelize.DataTypes);
const Permission = definePermission(sequelize, Sequelize.DataTypes);
const Role = defineRole(sequelize, Sequelize.DataTypes);
const User = defineUser(sequelize, Sequelize.DataTypes);
const Profile = defineProfile(sequelize, Sequelize.DataTypes);
const RolePermission = defineRolePermission(sequelize, Sequelize.DataTypes);
const TokenStore = defineTokenStore(sequelize, Sequelize.DataTypes);
const Party = defineParty(sequelize, Sequelize.DataTypes);
const Invoice = defineInvoice(sequelize, Sequelize.DataTypes);
const InvoiceItem = defineInvoiceItem(sequelize, Sequelize.DataTypes);
const Payment = definePayment(sequelize, Sequelize.DataTypes);
const Stock = defineStock(sequelize, Sequelize.DataTypes);
const Ledger = defineLedger(sequelize, Sequelize.DataTypes);

// define your model for associate relations here...
const models = { Business, StatusType, Role, Permission, RolePermission, User, Profile,  TokenStore, Party, Category, Unit, Item, Container, Invoice, InvoiceItem, Payment, Warehouse, Bank, Stock, Ledger };
// Call associate on each model if defined
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

// export your model here...
export {
  sequelize,
  Business,
  StatusType,
  User,
  Profile,
  Role,
  Permission,
  RolePermission,
  TokenStore,
  Party,
  Category,
  Unit,
  Item,
  Container,
  Invoice,
  InvoiceItem,
  Payment,
  Ledger,
  Warehouse,
  Bank,
  Stock

};