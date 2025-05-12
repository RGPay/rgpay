"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("produtos", "preco_compra", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("produtos", "preco_venda", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });
    // Remove old preco column if it exists
    const table = await queryInterface.describeTable("produtos");
    if (table.preco) {
      await queryInterface.removeColumn("produtos", "preco");
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("produtos", "preco_compra");
    await queryInterface.removeColumn("produtos", "preco_venda");
    await queryInterface.addColumn("produtos", "preco", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });
  },
}; 