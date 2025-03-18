const { DataTypes, Sequelize } = require('sequelize')
module.exports = (Sequelize) => {
    const UserModel = Sequelize.define('Users',
        {
            userId: { type: DataTypes.STRING, primaryKey: true },

            userName: { type: DataTypes.STRING, },

            phoneNumber: { type: DataTypes.STRING },

            email: { type: DataTypes.STRING, unique: true, },

            password: { type: DataTypes.STRING, },

            profilePic: { type: DataTypes.STRING },

            identityProof: { type: DataTypes.STRING, JSON },

            identityNumber: { type: DataTypes.STRING, JSON },

            skills: { type: DataTypes.JSON },

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
            tableName: 'Users'
        }

    );
    return UserModel;

}

