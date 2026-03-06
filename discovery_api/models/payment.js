// models/Payment.js
export default (sequelize, DataTypes) => {
  const Payment = sequelize.define("Payment", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    partyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    categoryId: {
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
    paymentType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amountPaid: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    bankId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "payments",
    timestamps: true,
    underscored: false,
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Party, { foreignKey: "partyId", as: "party" });
    Payment.belongsTo(models.Category, { foreignKey: "categoryId", as: "category" });
    Payment.belongsTo(models.Invoice, { foreignKey: "invoiceId", as: "invoice" });
    Payment.belongsTo(models.Business, { foreignKey: "businessId", as: "business" });
    Payment.belongsTo(models.Bank, { foreignKey: "bankId", as: "bank" });
    Payment.belongsTo(models.Container, { foreignKey: "containerId", as: "container" });

    Payment.belongsTo(models.User, { foreignKey: "createdBy", as: "createdByUser" });
    Payment.belongsTo(models.User, { foreignKey: "updatedBy", as: "updatedByUser" });
    Payment.belongsTo(models.User, { foreignKey: "deletedBy", as: "deletedByUser" });
  };

  return Payment;
};
