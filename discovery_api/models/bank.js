export default (sequelize, DataTypes) => {
  const Bank = sequelize.define(
    "Bank",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      businessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      accountName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      openingBalance: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "banks",
      timestamps: true,
      underscored: false,
    }
  );

  Bank.associate = (models) => {
    Bank.hasMany(models.Payment, {
      foreignKey: "bankId",
      as: "payments", // plural for clarity
    });

    Bank.hasMany(models.Stock, {
      foreignKey: "bankId",
      as: "stocks", // plural for clarity
    });

    Bank.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business",
    });
  };

  return Bank;
};
