// models/usersonglikes.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserSongLike extends Model {
        static associate(models) {
            UserSongLike.belongsTo(models.User, {
                foreignKey: 'userId',
                onDelete: 'CASCADE'
            });
            UserSongLike.belongsTo(models.Song, {
                foreignKey: 'songId',
                onDelete: 'CASCADE'
            });
        }
    }

    UserSongLike.init({
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        },
        songId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Songs',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'UserSongLike',
    });

    return UserSongLike;
};