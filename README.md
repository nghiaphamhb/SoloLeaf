# 🚚 SoloLeaf — Food Ordering Web App

## Demo

[Video demo](https://drive.google.com/file/d/15AkF5bdbGzmWW6DOpli2NOHvw-HJnUYu/view?usp=sharing)

## Overview
SoloLeaf is a fullstack web ordering app (multi-restaurant), which includes **frontend + backend + database**.

## Features
### User
-  Register / Login / log out
-  Order foods
-  Pay the bills (support discount ⏳)
-  View orders history
-  Search foods / restaurants (⏳)
-  Mark favorite dishes (⏳)
-  Messaging with restaurant management (⏳)
-  Get free discount per day (⏳)
-  Edit profile (⏳)

### Admin (⏳)
-  CRUD restaurant / food 
-  Order management 

## Tech Stack
### Frontend

-  Language: `JavaScript`
-  Framework: `React`
-  State Management: `Redux Toolkit`
-  Build Tool: `Vite`
-  Linters: `ESLint` + `StyleLint` + `Prettier`
-  Testing:
    - Unit &  Integration Testing: `Jest`
    - 2E2 Testing: `Cypress`
-  Component Libraries: `Material UI`
-  Web APIs: (⏳)
-  Web Worker: (⏳)
-  Analytics: `Google Analytics` (⏳)
-  Deployment: `Vercel`
-  Cross-Platform: `Docker Compose` (⏳)

### Backend

#### Main
-  Language: `Java` 
-  Framework: `Spring Boot`
-  Security: `Spring Security` + `JWT`
-  ORM Framework: `Hibernate`
-  Testing: `Maven build` + `Docker image build`
-  Deployment: `Render (Docker Web Service)`

#### Microservices (⏳)
-  Language: `JavaScript`
-  Framework: `Express.js`

### Database
- Database: `PostgreSQL`
- Deployment: `Render PostgreSQL`


### DevOps 
- `Docker` + `Docker Compose` (⏳)
- `CI/CD GitHub Actions`

### Integrations / API / Utils
- **Integrated Stripe API for payment**: create `Checkout Session`and
  handle `Webhook Events` to confirm payment and update orders.
- **Image Store**: `Supabase (Buckets)`
