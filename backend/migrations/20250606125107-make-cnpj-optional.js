'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Make CNPJ column nullable (explicitly document this change)
    await queryInterface.changeColumn('unidades', 'cnpj', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert CNPJ column to be not nullable (warning: this may fail if there are NULL values)
    await queryInterface.changeColumn('unidades', 'cnpj', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
