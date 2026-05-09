export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneCode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: "users",      // match your existing table exactly
    freezeTableName: true,   // prevent Sequelize from pluralizing
    timestamps: true,        // use if table has createdAt & updatedAt
    defaultScope: {
      attributes: { exclude: ["password"] }
    },
    scopes: {
      withPassword: { attributes: {} }
    }
  });

  User.associate = (models) => {
    User.belongsTo(models.Business, {
      foreignKey: "businessId",
      as: "business"
    });

    User.belongsTo(models.Role, {
      foreignKey: "roleId",
      as: "role"
    });

    User.hasOne(models.Profile, {
      foreignKey: "userId",
      as: "profile"
    });

    User.hasMany(models.Invoice, {
      foreignKey: "createdBy",
      as: "createdByUsers"
    });

    User.hasMany(models.Invoice, {
      foreignKey: "updatedBy",
      as: "updatedByUsers"
    });
  };

  return User;
};
