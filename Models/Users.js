const { DataTypes, Sequelize } = require("sequelize");
module.exports = (Sequelize) => {
  const UserModel = Sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      userName: { type: DataTypes.STRING },

      phoneNumber: { type: DataTypes.STRING },

      email: { type: DataTypes.STRING, unique: true },

      userId: { type: DataTypes.STRING, unique: true },

      password: { type: DataTypes.STRING },

      aadharNumber: { type: DataTypes.STRING, unique: true },
      gender: { type: DataTypes.STRING },

      donateNumber: { type: DataTypes.STRING },

      address: { type: DataTypes.STRING },

      dob: { type: DataTypes.STRING },

      gender: { type: DataTypes.STRING },

      marriage_status: { type: DataTypes.STRING },

      profilePic: { type: DataTypes.STRING },

      address: { type: DataTypes.STRING },

      dob: { type: DataTypes.STRING },

      marriage_status: { type: DataTypes.STRING },

      profilePic: { type: DataTypes.STRING },

      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
      },
    },
    {
      timestamps: true,
      tableName: "Users",
    }
  );
  return UserModel;
};
