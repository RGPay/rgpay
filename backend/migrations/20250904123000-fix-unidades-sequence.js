'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Re-sync sequence for unidades.id_unidade to avoid duplicate key errors
    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('unidades','id_unidade'), COALESCE((SELECT MAX(id_unidade) FROM unidades), 0));"
    );
  },

  async down(queryInterface, Sequelize) {
    // No-op safe down: leave sequence as-is
  },
};


