const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const systemUserModel = sequelize.define(
    'blockedNumbers',
    {
      Id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      blockedNumber: { type: DataTypes.STRING,},
      BookingNumber: { type: DataTypes.STRING },
      UserId: { type: DataTypes.STRING },
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
      tableName: 'blockedNumbers',
    }
  );
  return systemUserModel;
};
