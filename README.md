# 🚚 SoloLeaf — Food Ordering Web App

## Demo

[Video demo](https://drive.google.com/file/d/1j-fzAcYqbOizmSRsecNJhSi6gncerSQ1/view?usp=sharing)

## Overview
SoloLeaf is a fullstack web ordering app (multi-restaurant), which includes **frontend + backend + database**.

## Features
### User
-  **Register / Login / log out**
-  **Order foods** (support shopping cart)
-  **Pay bills** (support discount by restaurants)
-  **View orders history**
-  **Search foods** (All/ By restaurants)
-  **Mark favorite dishes** (⏳)
-  **Lucky spin** (Get free discount by restaurants)
-  **Edit profile** (⏳)

[//]: # (-  Messaging with restaurant management &#40;⏳&#41;)

[//]: # (### Admin &#40;⏳&#41;)

[//]: # (-  CRUD restaurant / food )

[//]: # (-  Order management )

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
-  Web APIs: `Canvas 2D` + `Clipboard`
-  Web Worker: client-side background ranking for search results
-  Analytics: `Google Analytics`
-  Deployment: `Vercel`
-  Error Monitoring: `Bugsnag`

### Backend

#### Main
-  Language: `Java` 
-  Framework: `Spring Boot`
-  Security: `Spring Security` + `JWT`
-  ORM Framework: `Hibernate`
-  Testing: `Maven build` + `Docker image build`
-  Deployment: `Render (Docker Web Service)`

#### Microservices
-  Language: `JavaScript`
-  Runtime: `Node.js`
-  Framework: `Express.js`
-  Middleware: `morgan` _(HTTP request logger)_ 
-  Deployment: ?

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
