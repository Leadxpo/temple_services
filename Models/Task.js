const { DataTypes, Sequelize } = require('sequelize');
module.exports = (Sequelize) => {
    const usermodel = Sequelize.define('Task', {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true, // Use autoIncrement for automatic ID generation
            unique: true
        },
        Name: { type: DataTypes.STRING, },
       
        Categories: { type: DataTypes.STRING, },
        CategoryId: { type: DataTypes.STRING, },
        SubCategoryId: { type: DataTypes.STRING, },
        Product_image: { type: DataTypes.STRING, },
    }, {
        timestamps: true,
        tableName: 'Task'
    });

    return usermodel;
}