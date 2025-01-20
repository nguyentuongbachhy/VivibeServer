'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Songs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      thumbnailUrl: {
        type: Sequelize.STRING
      },
      artistId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Artists',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      albumId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Albums',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      audio: {
        type: Sequelize.STRING,
        allowNull: false
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      lyrics: {
        type: Sequelize.TEXT
      },
      views: {
        type: Sequelize.BIGINT,
        defaultValue: 0
      },
      likes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      dominantColor: {
        type: Sequelize.INTEGER
      },
      climaxStart: {
        type: Sequelize.INTEGER
      },
      climaxEnd: {
        type: Sequelize.INTEGER
      },
      commentBranchId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      commentCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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

    // Add index for comment branch lookup
    await queryInterface.addIndex('Songs', ['commentBranchId']);
  },

  // async up(queryInterface, Sequelize) {
  //   await queryInterface.addConstraint('Songs', {
  //     fields: ['commentBranchId'],
  //     type: 'foreign key',
  //     name: 'songs_comment_branch_fk',
  //     references: {
  //       table: 'Comments',
  //       field: 'id'
  //     },
  //     onDelete: 'SET NULL',
  //     onUpdate: 'CASCADE'
  //   });
  // },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Songs');
  }
};