'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Unidade
    await queryInterface.createTable('unidades', {
      id_unidade: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: Sequelize.STRING,
      cnpj: {
        type: Sequelize.STRING,
        allowNull: true, // Made optional from migration 20250606125107
      },
      cidade: Sequelize.STRING,
      estado: Sequelize.STRING,
      endereco: Sequelize.STRING,
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 2. Categoria
    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 3. Usuario
    await queryInterface.createTable('usuarios', {
      id_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: Sequelize.STRING,
      email: Sequelize.STRING,
      senha_hash: Sequelize.STRING,
      tipo_usuario: {
        type: Sequelize.ENUM('master', 'gerente'),
        allowNull: false,
      },
      id_unidade: {
        type: Sequelize.INTEGER,
        references: { model: 'unidades', key: 'id_unidade' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 4. Produto (includes all changes from subsequent migrations)
    await queryInterface.createTable('produtos', {
      id_produto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: Sequelize.STRING,
      preco_compra: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      preco_venda: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      disponivel: Sequelize.BOOLEAN,
      estoque: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      imagem: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      id_unidade: {
        type: Sequelize.INTEGER,
        references: { model: 'unidades', key: 'id_unidade' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 5. Maquineta
    await queryInterface.createTable('maquinetas', {
      id_maquineta: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      numero_serie: Sequelize.STRING,
      status: {
        type: Sequelize.ENUM('ativa', 'inativa'),
        allowNull: false,
      },
      id_unidade: {
        type: Sequelize.INTEGER,
        references: { model: 'unidades', key: 'id_unidade' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 6. Evento
    await queryInterface.createTable('eventos', {
      id_evento: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: Sequelize.STRING,
      descricao: Sequelize.STRING,
      data_inicio: Sequelize.DATE,
      data_fim: Sequelize.DATE,
      id_unidade: {
        type: Sequelize.INTEGER,
        references: { model: 'unidades', key: 'id_unidade' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 7. Pedido
    await queryInterface.createTable('pedidos', {
      id_pedido: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      data_hora: Sequelize.DATE,
      valor_total: Sequelize.DECIMAL(10, 2),
      id_maquineta: {
        type: Sequelize.INTEGER,
        references: { model: 'maquinetas', key: 'id_maquineta' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      id_unidade: {
        type: Sequelize.INTEGER,
        references: { model: 'unidades', key: 'id_unidade' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      id_evento: {
        type: Sequelize.INTEGER,
        references: { model: 'eventos', key: 'id_evento' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      forma_pagamento: {
        type: Sequelize.ENUM('dinheiro', 'credito', 'debito', 'pix'),
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 8. ItemPedido
    await queryInterface.createTable('itens_pedido', {
      id_item_pedido: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      quantidade: Sequelize.INTEGER,
      preco_unitario: Sequelize.DECIMAL(10, 2),
      id_pedido: {
        type: Sequelize.INTEGER,
        references: { model: 'pedidos', key: 'id_pedido' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      id_produto: {
        type: Sequelize.INTEGER,
        references: { model: 'produtos', key: 'id_produto' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 9. User Settings (from migration 20250115120000)
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

    // 10. Refresh Tokens (from migration 20250512150000)
    await queryInterface.createTable('refresh_tokens', {
      id_refresh_token: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id_usuario',
        },
        onDelete: 'CASCADE',
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop tables in reverse order to avoid FK constraint errors
    await queryInterface.dropTable('refresh_tokens');
    await queryInterface.dropTable('user_settings');
    await queryInterface.dropTable('itens_pedido');
    await queryInterface.dropTable('pedidos');
    await queryInterface.dropTable('eventos');
    await queryInterface.dropTable('maquinetas');
    await queryInterface.dropTable('produtos');
    await queryInterface.dropTable('usuarios');
    await queryInterface.dropTable('categories');
    await queryInterface.dropTable('unidades');
  },
};
