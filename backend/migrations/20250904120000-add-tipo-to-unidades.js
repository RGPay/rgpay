'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add "tipo" to unidades to support different establishment types
    await queryInterface.addColumn('unidades', 'tipo', {
      type: Sequelize.ENUM('casa_show', 'bar', 'restaurante'),
      allowNull: false,
      defaultValue: 'bar',
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop enum column and its enum type
    await queryInterface.removeColumn('unidades', 'tipo');
    // Postgres keeps ENUM types; for safety try to drop if supported in the dialect
    if (queryInterface.sequelize.getDialect() === 'postgres') {
      await queryInterface.sequelize.query(
        "DROP TYPE IF EXISTS \"enum_unidades_tipo\";"
      );
    }
  },
};


