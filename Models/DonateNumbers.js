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
      UserId: { type: DataTypes.STRING },
      UserName: { type: DataTypes.STRING },
      phoneNumber: { type: DataTypes.STRING,},
      dob: { type: DataTypes.STRING },
      relation: { type: DataTypes.STRING },
      gothram: { type: DataTypes.STRING },
      
    },
    {
      timestamps: true,
      tableName: 'donateNumbers',
    }
  );
  return systemUserModel;
};
