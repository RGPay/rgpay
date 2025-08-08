# ✅ TO-DO LIST — Backend for POS Terminal Integration (RGPay)

---

## 🔧 1. Environment Setup

- [ ] Create project structure using NestJS with TypeScript.  
- [ ] Configure ESLint and Prettier for code formatting and linting.  
- [ ] Create environment variables for database, JWT, API port, etc.  
- [ ] Configure CORS to allow requests from POS terminal apps.  

---

## 🛠️ 2. Data Modeling and Core Entities

- [ ] Define models and tables in Sequelize:  
  - [ ] `Waiter`  
  - [ ] `POSDevice`  
  - [ ] `Product`  
  - [ ] `ProductCategory`  
  - [ ] `Order`  
  - [ ] `OrderItem`  
  - [ ] `Payment`  
  - [ ] `Event`  
  - [ ] `Unit`  
  - [ ] `User` (if relevant for POS login)  
- [ ] Create associations between models (e.g., `Order.belongsTo(Waiter)`, etc.).  
- [ ] Synchronize models with PostgreSQL via Sequelize.  

---

## 🔐 3. Authentication and Security

- [ ] Implement JWT-based authentication for POS terminals.  
- [ ] Create endpoint for POS login via ID or QR Code.  
- [ ] Ensure each POS can only access data for its assigned unit.  

---

## 📥 4. Data Synchronization with POS Terminals

- [ ] Create endpoint for POS terminals to fetch data:  
  - [ ] Complete menu (products + categories).  
  - [ ] Unit and current event information.  
  - [ ] POS device and logged-in waiter details.  
- [ ] Implement versioning or timestamps to avoid redundant downloads.  

---

## 🧾 5. Order and Payment Flow

- [ ] Create endpoint to register a new order:  
  - [ ] Include products, quantities, prices, and payment method.  
  - [ ] Handle cash, Pix, or card payments.  
  - [ ] Return payload with all data needed for receipt printing.  
- [ ] Create endpoint to retrieve previous orders from the POS terminal.  
- [ ] Create endpoint to check total cash received for a given period.  

---

## 🖨️ 6. Receipt Generation

- [ ] Include in response payload the receipt details:  
  - [ ] Unit name and logo (URL or base64).  
  - [ ] Purchased items, prices, and payment method.  
  - [ ] Order identification (ID, timestamp).  
- [ ] (Optional) Create endpoint for receipt reprint.  

---

## 📊 7. Reports and Cash Control per Waiter

- [ ] Create endpoint for POS terminals to check total cash collected.  
- [ ] Create endpoint to reset cash value after reconciliation (authorized action).  
- [ ] Create endpoint to retrieve orders by event, POS device, or waiter.  

---

## 🔄 8. Future Synchronization and Updates

- [ ] Create endpoint for POS devices to send status pings (e.g., online/offline).  
- [ ] Create endpoint for offline synchronization (batch sending of pending orders).  
- [ ] Create a simple logging and tracking mechanism for every order and payment.  

---

## 🧪 9. Testing and Documentation

- [ ] Write automated tests for main routes.  
- [ ] Document API with Swagger (including sample payloads).  
- [ ] Validate data input using DTOs and Pipes in NestJS.  
- [ ] Create developer documentation for POS app teams.  
