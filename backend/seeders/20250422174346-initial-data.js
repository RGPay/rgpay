'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Unidades (bars in Recife)
    await queryInterface.bulkInsert('unidades', [
      {
        id_unidade: 1,
        nome: 'Bar do Centro',
        cnpj: '12345678000100',
        cidade: 'Recife',
        estado: 'PE',
        endereco: 'Rua da Aurora, 100',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_unidade: 2,
        nome: 'Bar do Mangue',
        cnpj: '98765432000199',
        cidade: 'Recife',
        estado: 'PE',
        endereco: 'Av. Boa Viagem, 200',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Usuarios
    await queryInterface.bulkInsert('usuarios', [
      {
        id_usuario: 1,
        nome: 'Alice Master',
        email: 'alice@bardocentro.com',
        senha_hash: 'hash1',
        tipo_usuario: 'master',
        id_unidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_usuario: 2,
        nome: 'Bob Gerente',
        email: 'bob@bardocentro.com',
        senha_hash:
          '$2b$10$gzX.lruZB2EM/oqnehGMbeRWGaBi16cf0nGgasbkDSNToxWScZHAq',
        tipo_usuario: 'gerente',
        id_unidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_usuario: 3,
        nome: 'Carol Master',
        email: 'carol@bardomangue.com',
        senha_hash: 'hash3',
        tipo_usuario: 'master',
        id_unidade: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Produtos (bar menu)
    await queryInterface.bulkInsert('produtos', [
      {
        id_produto: 1,
        nome: 'Cerveja Artesanal',
        preco: 12.0,
        categoria: 'Bebida',
        disponivel: true,
        id_unidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_produto: 2,
        nome: 'Petisco Nordestino',
        preco: 25.0,
        categoria: 'Comida',
        disponivel: true,
        id_unidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_produto: 3,
        nome: 'Caipirinha de Frutas',
        preco: 18.0,
        categoria: 'Bebida',
        disponivel: true,
        id_unidade: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Maquinetas
    await queryInterface.bulkInsert('maquinetas', [
      {
        id_maquineta: 1,
        numero_serie: 'M123',
        status: 'ativa',
        id_unidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_maquineta: 2,
        numero_serie: 'M456',
        status: 'ativa',
        id_unidade: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Eventos (live shows)
    await queryInterface.bulkInsert('eventos', [
      {
        id_evento: 1,
        nome: 'Noite do Samba',
        descricao: 'Show de samba ao vivo com artistas locais',
        data_inicio: new Date('2025-05-01T20:00:00'),
        data_fim: new Date('2025-05-01T23:59:00'),
        id_unidade: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_evento: 2,
        nome: 'Rock Mangue',
        descricao: 'Festival de bandas de rock independentes',
        data_inicio: new Date('2025-06-10T18:00:00'),
        data_fim: new Date('2025-06-10T23:59:00'),
        id_unidade: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Pedidos
    await queryInterface.bulkInsert('pedidos', [
      {
        id_pedido: 1,
        data_hora: new Date('2025-05-01T20:30:00'),
        valor_total: 37.0,
        id_maquineta: 1,
        id_unidade: 1,
        id_evento: 1,
        forma_pagamento: 'credito',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_pedido: 2,
        data_hora: new Date('2025-05-01T19:00:00'),
        valor_total: 18.0,
        id_maquineta: 2,
        id_unidade: 2,
        id_evento: 2,
        forma_pagamento: 'pix',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // ItensPedido
    await queryInterface.bulkInsert('itens_pedido', [
      {
        id_item_pedido: 1,
        quantidade: 2,
        preco_unitario: 12.0,
        id_pedido: 1,
        id_produto: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_item_pedido: 2,
        quantidade: 1,
        preco_unitario: 25.0,
        id_pedido: 1,
        id_produto: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_item_pedido: 3,
        quantidade: 1,
        preco_unitario: 18.0,
        id_pedido: 2,
        id_produto: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('itens_pedido', null, {});
    await queryInterface.bulkDelete('pedidos', null, {});
    await queryInterface.bulkDelete('eventos', null, {});
    await queryInterface.bulkDelete('maquinetas', null, {});
    await queryInterface.bulkDelete('produtos', null, {});
    await queryInterface.bulkDelete('usuarios', null, {});
    await queryInterface.bulkDelete('unidades', null, {});
  },
};
