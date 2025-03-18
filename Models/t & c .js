const { DataTypes } = require('sequelize');
module.exports = (Sequelize) => {
    const usermodel = Sequelize.define('termsconditions',
        {
            id: { type: DataTypes.STRING, primaryKey: true },

            heading: { type: DataTypes.STRING, },

            description: { type: DataTypes.TEXT, }, // Changed to TEXT to store larger data

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
            tableName: 'termsconditions'
        }
    );
    return usermodel;
};
