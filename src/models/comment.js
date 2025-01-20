'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {
            Comment.belongsTo(models.Song, {
                foreignKey: 'songId',
                onDelete: 'CASCADE'
            });
            Comment.belongsTo(models.User, {
                foreignKey: 'userId'
            });
        }
    }

    Comment.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        songId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Song',
                key: 'id'
            },
            allowNull: true // Root node has null songId
        },
        lft: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rgt: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        depth: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true // Allow null for virtual root and song nodes
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: true, // Allow null for virtual root and song nodes
            references: {
                model: 'User',
                key: 'id'
            }
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        isVirtual: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Comment',
        indexes: [
            {
                fields: ['songId', 'lft', 'rgt']
            }
        ]
    });

    return Comment;
};