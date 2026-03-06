// models/Invoice.js
export default (sequelize, DataTypes) => {
  const Invoice = sequelize.define("Invoice", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    invoiceRefId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    containerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    prefix: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vatInvoiceNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    invoiceType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    partyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0 },
    },
    vatAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    isVat: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    vatPercentage: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: true,
    },
    ounceRate: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    ounceRateGram: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    grandTotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    system: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deletedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: "invoices",
    timestamps: true,
    underscored: false,
  });

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.Category, { foreignKey: "categoryId", as: "category", onDelete: "CASCADE", onUpdate: "CASCADE" });
    Invoice.belongsTo(models.Party, { foreignKey: "partyId", as: "party" });
    Invoice.belongsTo(models.Business, { foreignKey: "businessId", as: "business" });

    Invoice.hasMany(models.InvoiceItem, { foreignKey: "invoiceId", as: "items", onDelete: "CASCADE" });
    Invoice.hasMany(models.Payment, { foreignKey: "invoiceId", as: "payments" });
    Invoice.hasMany(models.Stock, { foreignKey: "invoiceId", as: "stocks" });
    Invoice.belongsTo(models.Container, { foreignKey: "containerId", as: "container" });

    Invoice.belongsTo(models.User, { foreignKey: "createdBy", as: "createdByUser" });
    Invoice.belongsTo(models.User, { foreignKey: "updatedBy", as: "updatedByUser" });
    Invoice.belongsTo(models.User, { foreignKey: "deletedBy", as: "deletedByUser" });
  };

  return Invoice;
};
