export default (sequelize, DataTypes) => {
  const Item = sequelize.define("Item", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    code: DataTypes.STRING,
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vatPercentage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    purity: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    itemType: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    tableName: "items",
    timestamps: true
  });

  Item.associate = (models) => {
    Item.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
    
    Item.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business"
    });
  };

  return Item;
};
