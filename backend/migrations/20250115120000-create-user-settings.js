'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_settings', {
      id_setting: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        references: { model: 'usuarios', key: 'id_usuario' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
        unique: true, // One setting per user
      },
      theme_mode: {
        type: Sequelize.ENUM('light', 'dark'),
        allowNull: false,
        defaultValue: 'dark',
      },
      primary_color: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '#3070FF',
      },
      secondary_color: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '#00E5E0',
      },
      success_color: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '#00D97E',
      },
      error_color: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '#f44336',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_settings');
  },
};
