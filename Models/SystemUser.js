const { DataTypes, Sequelize } = require('sequelize')
module.exports = (Sequelize) => {
    const systemUserModel = Sequelize.define('systemUser',
        {
            userId: { type: DataTypes.STRING, primaryKey: true },

            userName: { type: DataTypes.STRING, },

            phoneNumber: { type: DataTypes.STRING },

            email: { type: DataTypes.STRING, unique: true, },

            password: { type: DataTypes.STRING, },

            profilePic: { type: DataTypes.STRING },

            emergencyContact: { type: DataTypes.STRING, allowNull: true },

            skills: { type: DataTypes.STRING },


            status: {
                type: DataTypes.STRING,
                defaultValue: "Pending",
                validate: {
                    isIn: [["Declined", "Approved", "Pending"]]
                },
            },

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
            tableName: 'systemUser'
        }

    );
    return systemUserModel;

}

