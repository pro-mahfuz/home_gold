export default (sequelize, DataTypes) => {
  const Container = sequelize.define('Container', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    businessId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    blNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    soNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    oceanVesselName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    voyageNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    agentDetails: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    placeOfReceipt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    portOfLoading: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    portOfDischarge: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    placeOfDelivery: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    containerNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sealNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'containers',
  });

  Container.associate = (models) => {
    Container.belongsTo(models.Business, {
      foreignKey: 'businessId',
      as: 'business',
    });

    Container.hasMany(models.Stock, {
      foreignKey: 'containerId',
      as: 'stocks'
    });

    Container.hasMany(models.Invoice, {
      foreignKey: 'containerId',
      as: 'invoices'
    });

    Container.hasMany(models.Payment, {
      foreignKey: 'containerId',
      as: 'payments'
    });

    Container.belongsTo(models.User, {
      foreignKey: 'createdUserId',
      as: 'createdBy',
    });

    Container.belongsTo(models.User, {
      foreignKey: 'updatedUserId',
      as: 'updatedBy',
    });
  };

  return Container;
};
