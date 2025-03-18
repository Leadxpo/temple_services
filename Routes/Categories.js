const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SubCategory = sequelize.define('categories', {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          
        },


        Name: { type: DataTypes.STRING },

        sub_categories_id: { type: DataTypes.STRING },

        categories_image: { type: DataTypes.JSON },

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
        tableName: 'categories'
    });

    return SubCategory;
}
