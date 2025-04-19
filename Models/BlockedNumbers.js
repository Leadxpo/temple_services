const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const systemUserModel = sequelize.define(
    'blockedNumbers',
    {
      blockId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      
      blockedNumber: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,

      },

      status: {
        type: DataTypes.STRING,
        defaultValue: 'Active', // Default value is set to 'Active'
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      }
      
     
      
    },
    {
      timestamps: true,
      tableName: 'blockedNumbers',
    }
  );
  return systemUserModel;
};
