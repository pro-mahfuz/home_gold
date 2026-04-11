export default (sequelize, DataTypes) => {
  const GoldPriceIn = sequelize.define(
    "GoldPriceIn",
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
      goldSpotRate: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      dollarRate: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      ounceRateDirham: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      ounceGram: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      "999_rateGram": {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      "995_rateGram": {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      "992_rateGram": {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      buyRate: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      sellRate: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      carretRate: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      buy_MC: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      sell_MC: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      carret_MC: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      buy_CC: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      sell_CC: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      carret_CC: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      buyAddProfit: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      sellAddProfit: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      carretAddProfit: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      buyPricePerGram: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      sellPricePerGram: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      carretPricePerGram: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      boriGram: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      buyTotalDirham: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      sellTotalDirham: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      carretTotalDirham: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      buyBdtRate: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      sellBdtRate: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      carretBdtRate: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      buyTotalBdtBori: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      sellTotalBdtBori: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      carretTotalBdtBori: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "gold_price_ins",
      timestamps: true,
      underscored: false,
    }
  );

  GoldPriceIn.associate = (models) => {
    GoldPriceIn.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business",
    });

    GoldPriceIn.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "createdByUser",
    });

    GoldPriceIn.belongsTo(models.User, {
      foreignKey: "updatedBy",
      as: "updatedByUser",
    });
  };

  return GoldPriceIn;
};
