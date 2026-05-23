# ElectroShop Backend

This is a minimal Spring Boot backend for the ElectroShop React frontend. It provides JPA entities, repositories and REST endpoints for auth, products, purchases and invoices.


Database: this project can use MySQL. The default `application.properties` is configured to connect to a MySQL database named `electroshop` on `localhost` using username `root` and password `codeforfazal`.

To create the database manually (if needed):

```sql
-- run in MySQL shell or a client with a privileged user
CREATE DATABASE IF NOT EXISTS electroshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Run the backend:

```bash
cd backend
mvn -DskipTests spring-boot:run
```

Endpoints (examples):
- `POST /api/auth/register` — JSON body with name,email,phone,password
- `POST /api/auth/login` — JSON body with email,password; returns user (password omitted)
- `GET /api/products` — list products
- `POST /api/products` — create/update product
- `POST /api/invoices` — create invoice (updates inventory)
- `POST /api/purchases` — create purchase (restocks inventory)

Frontend integration: update React `services/api.js` to point to backend (e.g. `http://localhost:8080/api`).
