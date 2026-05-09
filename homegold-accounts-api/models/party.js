export default (sequelize, DataTypes) => {
  const Party = sequelize.define(
    "Party",
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
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      countryCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nationalId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tradeLicense: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      trnNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      openingBalance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "parties",
      timestamps: true,
      underscored: false,
    }
  );

  // Associations
  Party.associate = (models) => {
    Party.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business",
    });

    Party.hasMany(models.Payment, {
      foreignKey: "partyId",
      as: "payments", // plural for clarity
    });

    Party.hasMany(models.Invoice, {
      foreignKey: "partyId",
      as: "invoices", // plural for clarity
    });

    Party.hasMany(models.Stock, {
      foreignKey: "partyId",
      as: "stocks", // plural for clarity
    });

    Party.hasMany(models.Ledger, {
      foreignKey: "partyId",
      as: "ledgers", // plural for clarity
    });
  };

  return Party;
};
