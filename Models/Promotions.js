const { request } = require('express');
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SubCategory = sequelize.define('promotions', {
        promotionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          
        },


        dateOfSend: { type: DataTypes.STRING },

        title: { type: DataTypes.STRING },

        type: { type: DataTypes.STRING },

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
        tableName: 'promotions'
    });

    return SubCategory;
}
