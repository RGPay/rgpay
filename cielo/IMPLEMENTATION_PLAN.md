# Plano de Implementação: App Mobile Cielo LIO (React Native)

## 1. Visão Geral
Desenvolver um app mobile em React Native para rodar na Cielo LIO, permitindo ao garçom:
- Visualizar o cardápio (produtos) da unidade
- Selecionar itens e montar pedidos
- Realizar o pagamento via integração Cielo LIO (SDK/Deeplink)
- Imprimir ticket/comprovante
- Sincronizar pedidos e status com o backend

## 2. Stack Mobile
- React Native (0.72+)
- TypeScript
- React Navigation
- Axios (REST API)
- Integração Cielo LIO (SDK/Deeplink)
- Componentização e Clean Code

## 3. Arquitetura e Componentização
- **Padrão:** Separação por domínios (features/modules)
- **Principais pastas:**
  - `components/` (componentes reutilizáveis)
  - `screens/` (telas principais: Cardápio, Pedido, Pagamento, Confirmação)
  - `services/` (API, integração Cielo)
  - `store/` (gestão de estado, se necessário)
  - `dtos/` (tipos e interfaces)
- **Boas práticas:**
  - Clean code
  - Componentização
  - Código reutilizável

## 4. Integração com Backend
- **Fluxo:**
  1. App busca o cardápio (produtos) da unidade via API REST do backend
  2. App envia pedidos realizados para o backend registrar e atualizar status
  3. App pode consultar status de pedidos, eventos, etc.
- **Endpoints necessários:**
  - GET `/produtos?unidade=ID`
  - POST `/pedidos`
  - GET `/pedidos/:id`
  - (Opcional) GET `/eventos`, `/maquinetas`

## 5. Integração com Cielo LIO
- **Pagamento:**
  - Usar SDK/Deeplink para acionar o fluxo de pagamento na LIO
  - Montar JSON de pagamento conforme exemplo
  - Receber callback/status da transação
- **Impressão:**
  - Usar SDK/Deeplink para imprimir ticket após venda

## 6. Fluxo de Telas
1. **Login/Seleção de Unidade** (se necessário)
2. **Cardápio:**
   - Lista de produtos (busca do backend)
   - Seleção de itens/quantidades
3. **Resumo do Pedido:**
   - Itens selecionados, total, editar/remover
   - Botão "Finalizar Pedido"
4. **Pagamento:**
   - Integração com Cielo LIO
   - Exibir status (sucesso/erro)
5. **Confirmação/Impressão:**
   - Exibir comprovante
   - Imprimir ticket

## 7. Etapas de Desenvolvimento
1. **Setup do projeto React Native**
   - Configurar TypeScript, lint, prettier
   - Estruturar pastas e arquitetura
2. **Componentes básicos**
   - Botões, listas, inputs, etc.
3. **Integração com backend**
   - Implementar serviços para buscar produtos, enviar pedidos
4. **Fluxo de cardápio e pedido**
   - Telas de seleção e resumo
5. **Integração Cielo LIO**
   - Implementar chamada de pagamento e impressão
   - Tratar callbacks/status
6. **Gestão de estado (opcional)**
   - Usar Context API ou Redux se necessário
7. **Testes e validação**
   - Testar no emulador e na LIO real
8. **Ajustes finais e publicação**
   - Refino de UX/UI, testes de integração

## 8. Considerações Finais
- Seguir boas práticas: clean code, componentização, código reutilizável
- Documentar endpoints e integrações
- Garantir UX fluida e responsiva para uso em campo
- Validar integração Cielo LIO em ambiente real 