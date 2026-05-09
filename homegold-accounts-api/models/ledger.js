// models/Ledger.js
export default (sequelize, DataTypes) => {
  const Ledger = sequelize.define('Ledger', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,   // must be true for SET NULL
      references: {
        model: "categories",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    },
    transactionType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    partyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    stockId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bankId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    debit: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    credit: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    debitQty: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    stockCurrency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    creditQty: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    balance: {
      type: DataTypes.DECIMAL(12, 2),
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
    tableName: 'ledgers',
    timestamps: true,
    underscored: false,
  });

  Ledger.associate = (models) => {
    Ledger.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    Ledger.belongsTo(models.Party, { foreignKey: 'partyId', as: 'party' });
    Ledger.belongsTo(models.Business, { foreignKey: 'businessId', as: 'business' });
    Ledger.belongsTo(models.Invoice, { foreignKey: 'invoiceId', as: 'invoice' });
    Ledger.belongsTo(models.Payment, { foreignKey: 'paymentId', as: 'payment' });
    Ledger.belongsTo(models.Stock, { foreignKey: 'stockId', as: 'stock' });
    Ledger.belongsTo(models.Bank, { foreignKey: 'bankId', as: 'bank' });
    Ledger.belongsTo(models.User, { foreignKey: 'createdBy', as: 'createdByUser' });
    Ledger.belongsTo(models.User, { foreignKey: 'updatedBy', as: 'updatedByUser' });
    Ledger.belongsTo(models.User, { foreignKey: 'deletedBy', as: 'deletedByUser' });
  };

  return Ledger;
};
