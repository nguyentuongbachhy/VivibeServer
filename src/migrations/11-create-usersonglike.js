// migrations/create-user-song-likes.js
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('UserSongLikes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            songId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Songs',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Thêm unique constraint để đảm bảo mỗi user chỉ like mỗi bài hát một lần
        await queryInterface.addConstraint('UserSongLikes', {
            fields: ['userId', 'songId'],
            type: 'unique',
            name: 'unique_user_song_like'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('UserSongLikes');
    }
};