const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SubCategory = sequelize.define('sub_categories', {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          
        },


        Name: { type: DataTypes.STRING },

        categories_id: { type: DataTypes.STRING },

        sub_categories_image: { type: DataTypes.JSON },

        description: { type: DataTypes.STRING },
        
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
        tableName: 'sub_categories'
    });

    return SubCategory;
}
