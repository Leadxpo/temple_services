const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TaskModel = sequelize.define('Task', {
        taskId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true, // Ensure ID is auto-incremented
        },
        task: { type: DataTypes.STRING, allowNull: false },  // Added allowNull: false to ensure data must be present
        Categories: { type: DataTypes.STRING, allowNull: false },
        SubCategory: { type: DataTypes.STRING },
        targetedPostIn: { type: DataTypes.STRING },
        amount: { type: DataTypes.STRING },
        phoneNumber: { type: DataTypes.STRING },
        description: { type: DataTypes.STRING },
        status: { type: DataTypes.STRING },
      
    }, {
        timestamps: true,
        tableName: 'Task'
    });

    return TaskModel;
};
