module.exports = (sequelize, DataTypes) => {
    const UserSession = sequelize.define('user_sessions', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'aha_users',
                key: 'id',
            },
        },
        sessionType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    UserSession.associate = models => {
        UserSession.belongsTo(models.aha_users, {
            foreignKey: 'userId',
            as: 'user',
        });
    };

    return UserSession;
};
