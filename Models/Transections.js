const { request } = require('express');
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SubCategory = sequelize.define('Transections', {
        transectionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          
        },

        dateOfPayment: { type: DataTypes.STRING },
        taskOwner: { type: DataTypes.STRING },
        taskUser: { type: DataTypes.STRING },
        typeOfPayment: { type: DataTypes.STRING },
        payment: { type: DataTypes.STRING },
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
        tableName: 'Transections'
    });

    return SubCategory;
}
