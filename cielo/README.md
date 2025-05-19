# RGPay - Aplicativo Mobile para Cielo LIO

Aplicativo React Native para uma plataforma de gestão de vendas em máquinas Cielo LIO. O app permite a visualização do cardápio, montagem de pedidos, pagamentos e impressão de comprovantes diretamente na maquineta.

## Estrutura do Projeto

O projeto segue uma arquitetura modular:

```
src/
  ├── components/     # Componentes reutilizáveis (Button, ProductCard)
  ├── screens/        # Telas da aplicação (Menu, OrderSummary, PaymentConfirmation)
  ├── services/       # Serviços para API e integração Cielo
  ├── dtos/           # Tipos de dados e interfaces
  ├── @types/         # Definições de tipos personalizados
  └── App.tsx         # Componente principal e navegação
```

## Tecnologias

- React Native 0.72+
- TypeScript
- React Navigation
- Axios (API REST)
- Integração Cielo LIO (SDK/Deeplink)
- react-native-dotenv (Variáveis de ambiente)

## Pré-requisitos

- Node.js >= 16
- Yarn
- Android Studio
- JDK 11

## Configuração do Projeto

1. **Instalar dependências**

```bash
yarn install
```

2. **Configurar variáveis de ambiente**

Copie o arquivo `.env.example` para `.env` e ajuste as variáveis conforme necessário:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```
# API Configuration
API_URL=http://your-backend-url.com/api

# Cielo LIO Credentials
CIELO_ACCESS_TOKEN=your-access-token
CIELO_CLIENT_ID=your-client-id
CIELO_EMAIL=your@email.com
```

3. **Executando o Projeto**

### No emulador/dispositivo Android:

```bash
yarn android
```

### No dispositivo Cielo LIO:

Conecte a Cielo LIO ao seu computador via USB e execute:

```bash
yarn android
```

## Fluxo de Uso

1. Tela de Menu: Exibe o cardápio com os produtos disponíveis
2. Tela de Resumo do Pedido: Permite revisar itens e selecionar forma de pagamento
3. Tela de Confirmação: Exibe resultado do pagamento e permite impressão do comprovante

## Integração com Backend

O aplicativo se comunica com o backend através dos endpoints:

- `GET /produtos?unidade=ID`: Obtém lista de produtos
- `POST /pedidos`: Cria um novo pedido
- `GET /pedidos/:id`: Consulta detalhes de um pedido

## Integração com Cielo LIO

A integração com a Cielo LIO é feita através do SDK/Deeplink, conforme implementado no arquivo `src/services/Cielo.ts`. As principais funcionalidades incluem:

- Pagamento via cartão (débito/crédito)
- Processamento de transações
- Impressão de comprovantes

## Segurança

As credenciais do app são gerenciadas através de variáveis de ambiente no arquivo `.env`. Este arquivo **não** deve ser versionado no Git para garantir a segurança das credenciais.

## Desenvolvimento e Expansão

Para expandir este projeto:

1. Adicione novas telas em `src/screens/`
2. Crie novos componentes reutilizáveis em `src/components/`
3. Expanda os serviços para cobrir novos endpoints em `src/services/`

## Publicação na Cielo Store

Para publicar o app na Cielo Store e disponibilizá-lo nas maquinetas:

1. Gere o APK de release: `cd android && ./gradlew assembleRelease`
2. Acesse o Console da Cielo Store Dev
3. Siga o processo de publicação conforme documentação oficial

---

**Nota:** Este é um documento exemplo. Recomendo consultar a documentação oficial da Cielo e seus recursos para obter informações detalhadas e atualizadas sobre a integração com a Cielo LIO.
