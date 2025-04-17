const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const systemUserModel = sequelize.define(
    'donateNumbers',
    {
      donateId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      donateNumber: { type: DataTypes.STRING,},
      decription: { type: DataTypes.STRING },
      UserId: { type: DataTypes.STRING },
      
    },
    {
      timestamps: true,
      tableName: 'donateNumbers',
    }
  );
  return systemUserModel;
};
