export default (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: DataTypes.STRING,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: "categories",
    timestamps: true
  });

  Category.associate = (models) => {
    Category.belongsTo(models.Business, { foreignKey: "businessId", as: "business" });
    Category.hasMany(models.Item, { foreignKey: "categoryId", as: "items" });
  };

  return Category;
};