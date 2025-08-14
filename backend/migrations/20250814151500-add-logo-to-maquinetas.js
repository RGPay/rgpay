'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = 'maquinetas';
    const column = 'logo';
    // Only add if it does not exist (Postgres-specific check)
    const [results] = await queryInterface.sequelize.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = '${table}' AND column_name = '${column}'`
    );
    if (!results || results.length === 0) {
      await queryInterface.addColumn(table, column, {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = 'maquinetas';
    const column = 'logo';
    try {
      await queryInterface.removeColumn(table, column);
    } catch (_) {
      // noop
    }
  },
};


