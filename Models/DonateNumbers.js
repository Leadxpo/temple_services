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
      donateNumber: { type: DataTypes.STRING, unique: true },
      userId: { type: DataTypes.STRING },
      userName: { type: DataTypes.STRING },
      phoneNumber: { type: DataTypes.STRING,},
      dob: { type: DataTypes.STRING },
      relation: { type: DataTypes.STRING },
      gothram: { type: DataTypes.STRING },
      
      status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
        validate: {
          isIn: [["Declined", "Approved", "Pending"]],
        },
      },
    },
    {
      timestamps: true,
      tableName: 'donateNumbers',
    }
  );
  return systemUserModel;
};
