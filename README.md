# PS-30: Modular Component Showcase Application

A full-stack system for showcasing reusable UI components with categories, live previews, documentation, role-based management, and intelligent semantic search.

## 10-Point Project Completion

1. **Problem Identification**
   - Teams repeatedly rebuild common UI components because reusable components are hard to discover, preview, and understand.
   - This application centralizes components, documentation, usage examples, and intelligent search.

2. **Frontend UI**
   - Dark responsive React frontend in `frontend/`.
   - Displays the problem statement, marks criteria, component cards, categories, documentation, semantic search, JWT login, and admin actions.
   - Uses the API Gateway as the single integration point.

3. **API Gateway: FastAPI**
   - Located in `gateway/`.
   - Exposes unified `/gateway/*` endpoints for frontend clients.
   - Proxies auth and JWT-protected CRUD requests to Spring Boot backend.
   - Performs MongoDB semantic search and writes search usage logs.

4. **Backend: Spring Boot**
   - Located in `backend/`.
   - Provides JWT authentication, role-based access, category CRUD, and component CRUD.
   - Admin users can create, update, and delete components and categories.
   - Normal users can view and semantically search components.

5. **Database Design: PostgreSQL**
   - SQL schema in `database/postgres/schema.sql`.
   - Tables: `users`, `categories`, `components`, `usage_logs`.
   - Components are linked to categories and creators.

6. **MongoDB Design**
   - Seed script in `database/mongo/seed.js`.
   - Collections:
     - `component_descriptions`
     - `component_embeddings`
     - `usage_logs`

7. **Vector Search Requirement**
   - Gateway implements semantic component search over MongoDB descriptions and embeddings.
   - Example queries:
     - `Form validation components`
     - `Reusable dashboard widgets`
   - The implementation includes deterministic fallback embeddings for local demo use.

8. **System Integration**
   - Frontend calls FastAPI Gateway.
   - Gateway calls Spring Boot for relational CRUD.
   - Gateway calls MongoDB for semantic descriptions, embeddings, and logs.
   - Spring Boot uses PostgreSQL for users, roles, categories, and components.

9. **Security**
   - Spring Boot uses JWT bearer tokens.
   - Role-based authorization protects admin-only write APIs.
   - Passwords are stored using BCrypt.

10. **Testing and Demo Flow**
   - Register/login user from backend.
   - Browse components from frontend.
   - Search semantically through gateway.
   - Admin can add reusable UI components.
   - Usage logs are inserted into MongoDB whenever semantic search is used.

## Project Structure

```text
frontend/                 Browser UI
gateway/                  FastAPI API Gateway and semantic search
backend/                  Spring Boot backend
database/postgres/        PostgreSQL schema and seed SQL
database/mongo/           MongoDB seed script

```

## Quick Start

Start databases:




Run Spring Boot backend:

```powershell
cd backend/coreservices
.\mvn.cmd spring-boot:run
```

Run FastAPI gateway:

```powershell
cd gateway
pip install -r requirements.txt
uvicorn main:app --reload --port 9000
```

Open the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Then visit:

```text
http://localhost:5173
```

Demo users:

```text
admin@gmail.com / admin123
user@gmail.com / user123
```

## Default API URLs

- Frontend: `http://localhost:5173`
- FastAPI Gateway: `http://localhost:9000`
- Spring Boot Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432/modular_showcase`
- MongoDB: `localhost:27017`

## Main Endpoints

Gateway:

```text
GET  /health
POST /gateway/auth/login
POST /gateway/auth/signup
GET  /gateway/components
POST /gateway/components                 ADMIN
PUT  /gateway/components/{id}            ADMIN
DELETE /gateway/components/{id}          ADMIN
GET  /gateway/categories
POST /gateway/categories                 ADMIN
POST /gateway/search/semantic
```

Backend:

```text
POST /auth/signup
POST /auth/login
GET  /api/components            JWT
POST /api/components            ADMIN
# PS-30: Modular Component Showcase Application

A full-stack system for showcasing reusable UI components with categories, live previews, documentation, role-based management, and intelligent semantic search.

## 10-Point Project Completion

1. **Problem Identification**
   - Teams repeatedly rebuild common UI components because reusable components are hard to discover, preview, and understand.
   - This application centralizes components, documentation, usage examples, and intelligent search.

2. **Frontend UI**
   - Dark responsive React frontend in `frontend/`.
   - Displays the problem statement, marks criteria, component cards, categories, documentation, semantic search, JWT login, and admin actions.
   - Uses the API Gateway as the single integration point.

3. **API Gateway: FastAPI**
   - Located in `gateway/`.
   - Exposes unified `/gateway/*` endpoints for frontend clients.
   - Proxies auth and JWT-protected CRUD requests to Spring Boot backend.
   - Performs MongoDB semantic search and writes search usage logs.

4. **Backend: Spring Boot**
   - Located in `backend/`.
   - Provides JWT authentication, role-based access, category CRUD, and component CRUD.
   - Admin users can create, update, and delete components and categories.
   - Normal users can view and semantically search components.

5. **Database Design: PostgreSQL**
   - SQL schema in `database/postgres/schema.sql`.
   - Tables: `users`, `categories`, `components`, `usage_logs`.
   - Components are linked to categories and creators.

6. **MongoDB Design**
   - Seed script in `database/mongo/seed.js`.
   - Collections:
     - `component_descriptions`
     - `component_embeddings`
     - `usage_logs`

7. **Vector Search Requirement**
   - Gateway implements semantic component search over MongoDB descriptions and embeddings.
   - Example queries:
     - `Form validation components`
     - `Reusable dashboard widgets`
   - The implementation includes deterministic fallback embeddings for local demo use.

8. **System Integration**
   - Frontend calls FastAPI Gateway.
   - Gateway calls Spring Boot for relational CRUD.
   - Gateway calls MongoDB for semantic descriptions, embeddings, and logs.
   - Spring Boot uses PostgreSQL for users, roles, categories, and components.

9. **Security**
   - Spring Boot uses JWT bearer tokens.
   - Role-based authorization protects admin-only write APIs.
   - Passwords are stored using BCrypt.

10. **Testing and Demo Flow**
   - Register/login user from backend.
   - Browse components from frontend.
   - Search semantically through gateway.
   - Admin can add reusable UI components.
   - Usage logs are inserted into MongoDB whenever semantic search is used.

## Project Structure

```text
frontend/                 Browser UI
gateway/                  FastAPI API Gateway and semantic search
backend/                  Spring Boot backend
database/postgres/        PostgreSQL schema and seed SQL
database/mongo/           MongoDB seed script

```

## Quick Start

Start databases:




Run Spring Boot backend:

```powershell
cd backend/coreservices
.\mvn.cmd spring-boot:run
```

Run FastAPI gateway:

```powershell
cd gateway
pip install -r requirements.txt
uvicorn main:app --reload --port 9000
```

Open the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Then visit:

```text
http://localhost:5173
```

Demo users:

```text
admin@gmail.com / admin123
user@gmail.com / user123
```

## Default API URLs

- Frontend: `http://localhost:5173`
- FastAPI Gateway: `http://localhost:9000`
- Spring Boot Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432/modular_showcase`
- MongoDB: `localhost:27017`

## Main Endpoints

Gateway:

```text
GET  /health
POST /gateway/auth/login
POST /gateway/auth/signup
GET  /gateway/components
POST /gateway/components                 ADMIN
PUT  /gateway/components/{id}            ADMIN
DELETE /gateway/components/{id}          ADMIN
GET  /gateway/categories
POST /gateway/categories                 ADMIN
POST /gateway/search/semantic
```

Backend:

```text
POST /auth/signup
POST /auth/login
GET  /api/components            JWT
POST /api/components            ADMIN
PUT  /api/components/{id}       ADMIN
DELETE /api/components/{id}     ADMIN
GET  /api/categories            JWT
POST /api/categories            ADMIN
```

## Testing and Database Management Tools

### 1. MongoDB (MongoDB Compass / Mongo Shell)
To fetch and view MongoDB data:
- **Connection String:** `mongodb://localhost:27017`
- Open **MongoDB Compass** and connect using the above string.
- Navigate to the relevant database (e.g., `modular_showcase`).
- **Key Collections to view:** `component_descriptions`, `component_embeddings`, and `usage_logs`.

### 2. PostgreSQL (pgAdmin)
To run and view SQL queries on the relational database:
- Open **pgAdmin** and create a new server connection.
- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `modular_showcase`
- **Username/Password:** (Use the credentials configured in your Postgres setup, typically `postgres` / `postgres` or `admin` / `admin`).
- Navigate to `Databases` -> `modular_showcase` -> `Schemas` -> `public` -> `Tables`.
- You can right-click tables (`users`, `categories`, `components`) and select "View/Edit Data" or open the Query Tool to run custom SQL queries.

### 3. Postman
To test the API endpoints and view responses:
- Create a new workspace or collection in Postman.
- **Authentication:** First, make a `POST` request to `http://localhost:9000/gateway/auth/login` with valid credentials (e.g., `{"email": "admin@gmail.com", "password": "admin123"}`).
- Copy the `token` string from the JSON response.
- For protected routes (like adding or editing components), go to the request's **Authorization** tab, select **Bearer Token**, and paste your token.
- You can then test endpoints like `GET http://localhost:9000/gateway/components` or `POST http://localhost:9000/gateway/components`.

### 4. Spring Boot Backend
To observe and debug Spring Boot operations:
- Ensure the backend is running (`http://localhost:8000`).
- The Spring Boot application acts as the core service for relational CRUD and JWT validations.
- You can view the live console logs in the terminal where you executed `.\mvn.cmd spring-boot:run` to monitor the SQL queries executed by Hibernate, along with any application info, debug, or error messages.

## Contributors

- [veerisettyharshitha-sys](https://github.com/veerisettyharshitha-sys)
