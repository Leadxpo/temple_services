const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SubCategory = sequelize.define('Otp', {
        otpId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          
        },


        otp: { type: DataTypes.STRING },

        phoneNumber: { type: DataTypes.STRING },

        date: { type: DataTypes.JSON },

        time: { type: DataTypes.STRING },

        expareDuretion: { type: DataTypes.STRING },

        
       
    }, {
        timestamps: true,
        tableName: 'Otp'
    });

    return SubCategory;
}
