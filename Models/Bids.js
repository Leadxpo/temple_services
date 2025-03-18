const { request } = require('express');
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SubCategory = sequelize.define('bids', {
        BidId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          
        },


        bidOfAmount: { type: DataTypes.STRING },

        dateOfBids: { type: DataTypes.STRING },

        userId: { type: DataTypes.STRING },

        status: { type: DataTypes.STRING },
        
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW,
        },
    }, {
        timestamps: true,
        tableName: 'bids'
    });

    return SubCategory;
}
