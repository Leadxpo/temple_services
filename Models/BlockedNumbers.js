const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BlockedNumber = sequelize.define(
    'BlockedNumber',
    {
      blockId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      blockedNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'Active',
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
      tableName: 'blockedNumbers',
    }
  );

  return BlockedNumber;
};
