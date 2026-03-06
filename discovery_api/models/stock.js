// models/Stock.js
export default (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    invoiceType: {
      type: DataTypes.STRING(20), // 'purchase' or 'sale'
      allowNull: true,
    },
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    partyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    movementType: {
      type: DataTypes.ENUM('stock_in', 'stock_out', 'damaged'),
      allowNull: false,
    },
    prefix: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bankId: {
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
    itemId: {
      type: DataTypes.INTEGER,
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
    tableName: 'stocks',
    timestamps: true,
    underscored: false,
  });

  Stock.associate = (models) => {
    Stock.belongsTo(models.Party, { foreignKey: 'partyId', as: 'party' });
    Stock.belongsTo(models.Item, { foreignKey: 'itemId', as: 'item' });
    Stock.belongsTo(models.Invoice, { foreignKey: 'invoiceId', as: 'invoice' });
    Stock.belongsTo(models.Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });
    Stock.belongsTo(models.Bank, { foreignKey: 'bankId', as: 'bank' });
    Stock.belongsTo(models.Business, { foreignKey: 'businessId', as: 'business' });
    Stock.belongsTo(models.Container, { foreignKey: 'containerId', as: 'container' });
    Stock.belongsTo(models.User, { foreignKey: 'createdBy', as: 'createdByUser' });
    Stock.belongsTo(models.User, { foreignKey: 'updatedBy', as: 'updatedByUser' });
    Stock.belongsTo(models.User, { foreignKey: 'deletedBy', as: 'deletedByUser' });
  };

  return Stock;
};
