'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Re-sync sequence for categories.id to avoid duplicate key errors after seeded IDs
    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('categories','id'), COALESCE((SELECT MAX(id) FROM categories), 0));"
    );
  },

  async down(queryInterface, Sequelize) {
    // No-op
  },
};


