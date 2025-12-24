# 🚚 SoloLeaf — Food Ordering Web App

## Demo

[Video demo](https://drive.google.com/file/d/15AkF5bdbGzmWW6DOpli2NOHvw-HJnUYu/view?usp=sharing)

## Overview
SoloLeaf is a fullstack web ordering app (multi-restaurant), which includes **frontend + backend + database**.

## Features
### User
- Register / Login / log out
- Order foods
- Pay the bills (support discount)
- View orders history
- Search foods / restaurants (_**in progress**_)
- Mark favorite dishes (_**in progress**_)
- Messaging with restaurant management (_**in progress**_)
- Get free discount per day (_**in progress**_)
- Edit profile (_**in progress**_)

### Admin (_**in progress**_)
- CRUD restaurant / food
- Order management

## Tech Stack
### Frontend

- Language: `JavaScript`
- Framework: `React`
- State Management: `Redux Toolkit`
- Build Tool: `Vite`
- Linters: `ESLint` + `StyleLint`
- Testing:
    - Unit &  Integration Testing: `Jest` (_**in progress**_)
    - 2E2 Testing: `Cypress` (_**in progress**_)
- Component Libraries: `Material UI`
- Web APIs: ?
- Web Worker: ?
- Analytics: `Google Analytics` (_**in progress**_)
- Deployment: ?
- Cross-Platform: ?

### Backend

#### Main
- `Java Spring Boot`
- `Spring Security` + `JWT`
- `JPA/Hibernate`
- Docker: ?

#### Microservices
- `Node.js` (_**in progress**_)
- Framework: `Express.js`  (_**in progress**_)

### Database
- `PostgreSQL`

### DevOps 
- `Docker` + `Docker Compose` (_**in progress**_)
- `CI/CD GitHub Actions` (_**in progress**_)

### Integrations / API
- **Integrated Stripe API for payment**: create `Checkout Session`and
  handle `Webhook Events` to confirm payment and update orders.