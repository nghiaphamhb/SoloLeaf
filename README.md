# 🚚 SoloLeaf — Food Ordering Web App

## Demo

[Video demo](https://drive.google.com/file/d/15AkF5bdbGzmWW6DOpli2NOHvw-HJnUYu/view?usp=sharing)

## Overview
SoloLeaf is a fullstack web ordering app (multi-restaurant), which includes **frontend + backend + database**.

## Features
### User
- [x] Register / Login / log out
- [x] Order foods
- [x] Pay the bills (support discount)
- [x] View orders history
- [ ] Search foods / restaurants (_**in progress**_)
- [ ] Mark favorite dishes (_**in progress**_)
- [ ] Messaging with restaurant management (_**in progress**_)
- [ ] Get free discount per day (_**in progress**_)
- [ ] Edit profile (_**in progress**_)

### Admin (_**in progress**_)
- [ ] CRUD restaurant / food
- [ ] Order management

## Tech Stack
### Frontend

- [x] Language: `JavaScript`
- [x] Framework: `React`
- [x] State Management: `Redux Toolkit`
- [x] Build Tool: `Vite`
- [x] Linters: `ESLint` + `StyleLint`
- [ ] Testing:
    - Unit &  Integration Testing: `Jest` (_**in progress**_)
    - 2E2 Testing: `Cypress` (_**in progress**_)
- [x] Component Libraries: `Material UI`
- [ ] Web APIs: ?
- [ ] Web Worker: ?
- [ ] Analytics: `Google Analytics` (_**in progress**_)
- [ ] Deployment: ?
- [ ] Cross-Platform: ?

### Backend

#### Main
- [x] `Java Spring Boot`
- [x] `Spring Security` + `JWT`
- [x] `JPA/Hibernate`
- [ ] Docker: ?

#### Microservices
- [ ] `Node.js` (_**in progress**_)
- [ ] Framework: `Express.js`  (_**in progress**_)

### Database
- [x] `PostgreSQL`

### DevOps 
- [ ] `Docker` + `Docker Compose` (_**in progress**_)
- [ ] `CI/CD GitHub Actions` (_**in progress**_)

### Integrations / API
- [ ] **Integrated Stripe API for payment**: create `Checkout Session`and
  handle `Webhook Events` to confirm payment and update orders.