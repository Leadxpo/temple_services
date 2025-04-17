const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const systemUserModel = sequelize.define(
    'blockedNumbers',
    {
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      
      blockedNumber: { type: DataTypes.STRING,},
     
      
    },
    {
      timestamps: true,
      tableName: 'blockedNumbers',
    }
  );
  return systemUserModel;
};
