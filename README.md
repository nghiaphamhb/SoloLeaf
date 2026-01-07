# 🚚 SoloLeaf — Food Ordering Web App

## Demo

👉 [Video demo](https://drive.google.com/file/d/1tQeAcKfuKjVnrYQhQgWM2OOeETlKRljp/view?usp=sharing)

## Overview
SoloLeaf is a fullstack web ordering app (multi-restaurant), which includes **frontend + backend + database**.

## Features
### User
-  **Register / Login / Logout**
-  **Order foods** (support shopping cart)
-  **Pay bills** (support discount)
-  **View orders history**
-  **Search foods** (support EN/RUS, suggestion by AI-lite)
-  **Lucky spin** (Get free discount by restaurants)
-  **Edit profile** 

[//]: # (-  **Mark favorite dishes** &#40;⏳&#41;)

[//]: # (-  **Chatbot** supports ordering &#40;⏳&#41;)

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
-  Web APIs: 
     - `Canvas 2D`, `Clipboard`, `Fetch`, `FormData`, `URL / URLSearchParams`, ...
     -  `SearchRankWorker`: ranks search's results (_AI-lite_)
- Analytics: `Google Analytics`
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
-  Roles: 
   - **AI-lite Smart Search** (_query normalization, RU→EN mapping, suggestion handling_)

-  Deployment: `Render (Node Web Service)`

### Database
- Database: `PostgreSQL`
- Deployment: `Render (PostgreSQL)`


### DevOps 
- `Docker` + `Docker Compose`
- `CI/CD GitHub Actions`

### Integrations / API / Utils
- **Integrated Stripe API for payment**: create `Checkout Session`and
  handle `Webhook Events` to confirm payment and update orders.
- **Image Store/ Upload**: `Supabase (Buckets)`
