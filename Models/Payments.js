const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const systemUserModel = sequelize.define(
    'payments',
    {
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userName: { type: DataTypes.STRING, allowNull: false },
      phoneNumber: { type: DataTypes.STRING },
      Gothram: { type: DataTypes.STRING, allowNull: false },
      paymentRecept: { type: DataTypes.STRING },
      amount: { type: DataTypes.STRING, allowNull: true },



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
      tableName: 'payments',
    }
  );
  return systemUserModel;
};
