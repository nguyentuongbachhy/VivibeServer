'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Comments', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            songId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Songs',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: true
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            lft: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            rgt: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            depth: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            likes: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            isVirtual: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
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

        await queryInterface.addIndex('Comments', ['songId', 'lft', 'rgt'], {
            name: 'comments_song_tree_index'
        });

        // Create root node
        await queryInterface.bulkInsert('Comments', [{
            lft: 1,
            rgt: 2,
            depth: 0,
            isVirtual: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Comments');
    }
};