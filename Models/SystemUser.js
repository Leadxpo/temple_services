const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const systemUserModel = sequelize.define(
    'systemUser',
    {
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userName: { type: DataTypes.STRING, allowNull: false },
      phoneNumber: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING,  allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, allowNull: false },
      profilePic: { type: DataTypes.STRING },
      emergencyContact: { type: DataTypes.STRING, allowNull: true },
      skills: { type: DataTypes.STRING },
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
      tableName: 'systemUser',
    }
  );
  return systemUserModel;
};
