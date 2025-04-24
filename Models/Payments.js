const { DataTypes } = require('sequelize');
const moment = require('moment-timezone');

module.exports = (sequelize) => {
  const systemUserModel = sequelize.define(
    'payments',
    {
      paymentId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userName: { type: DataTypes.STRING, allowNull: false },
      phoneNumber: { type: DataTypes.STRING, unique: true },
      donateNumber: { type: DataTypes.STRING, unique: true },
      gothram: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.STRING, allowNull: false },
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
      hooks: {
        beforeCreate: (record) => {
          const nowIST = moment().tz("Asia/Kolkata").toDate();
          record.createdAt = nowIST;
          record.updatedAt = nowIST;
        },
        beforeUpdate: (record) => {
          record.updatedAt = moment().tz("Asia/Kolkata").toDate();
        },
      },
    }
  );

  return systemUserModel;
};
