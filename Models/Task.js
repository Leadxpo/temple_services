const { DataTypes, Sequelize } = require('sequelize');
module.exports = (Sequelize) => {
    const usermodel = Sequelize.define('Task', {
        taskId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true, // Use autoIncrement for automatic ID generation
        
        },
        task: { type: DataTypes.STRING, },
        Categories: { type: DataTypes.STRING, },
        SubCategory: { type: DataTypes.STRING, },
        targetedPostIn: { type: DataTypes.STRING, },
        amount: { type: DataTypes.STRING, },
        phoneNumber: { type: DataTypes.STRING, },
        description: { type: DataTypes.STRING, },
        status: { type: DataTypes.STRING, },


        Task_image: { type: DataTypes.STRING, },
    }, {
        timestamps: true,
        tableName: 'Task'
    });

    return usermodel;
}