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
      cnpj: Sequelize.STRING,
      cidade: Sequelize.STRING,
      estado: Sequelize.STRING,
      endereco: Sequelize.STRING,
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 2. Usuario
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
      tipo_usuario: Sequelize.ENUM('master', 'gerente'),
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

    // 3. Produto
    await queryInterface.createTable('produtos', {
      id_produto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: Sequelize.STRING,
      preco: Sequelize.DECIMAL(10, 2),
      categoria: Sequelize.STRING,
      disponivel: Sequelize.BOOLEAN,
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

    // 4. Maquineta
    await queryInterface.createTable('maquinetas', {
      id_maquineta: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      numero_serie: Sequelize.STRING,
      status: Sequelize.ENUM('ativa', 'inativa'),
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

    // 5. Pedido
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

    // 7. ItemPedido
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
  },

  async down(queryInterface, Sequelize) {
    // Drop tables in reverse order to avoid FK constraint errors
    await queryInterface.dropTable('itens_pedido');
    await queryInterface.dropTable('eventos');
    await queryInterface.dropTable('pedidos');
    await queryInterface.dropTable('maquinetas');
    await queryInterface.dropTable('produtos');
    await queryInterface.dropTable('usuarios');
    await queryInterface.dropTable('unidades');
    // Drop ENUM types (for Postgres, but MySQL ignores)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_usuarios_tipo_usuario";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_maquinetas_status";',
    );
  },
};
