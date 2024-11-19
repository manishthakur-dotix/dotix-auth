# Centralized Authentication System: Documentation

## Project Overview

A centralized authentication system using **Next.js** and **MySQL** to manage user authentication for multiple external projects.

---

## Key Features

### Login/Registration Redirection

- External projects redirect users to `auth.example.com` with a `callbackUrl`.
  - Example: `auth.example.com/login?callbackUrl=https://dashboard.app2.com`.
- The system checks if the `callbackUrl` is registered in the database.

### Token-Based Authentication

- After successful login/registration, a token is generated and sent back to the external project.
  - Example: `https://dashboard.app2.com/auth/callback?token=abc123`.

### API Authentication

- External projects call APIs with:
  - `token` (query parameter).
  - `x-client-apikey` (header).
- The API verifies the `apikey` and token, then returns user data.

### Session Management

- Manage user sessions, token validation, and expiration.

---

## Database Design

### 1. Users Table

Stores user information.

| Field       | Type        | Description               |
| ----------- | ----------- | ------------------------- |
| `id`        | Primary Key | Unique identifier         |
| `email`     | String      | User email (unique)       |
| `image`     | String      | User image                |
| `password`  | String      | Hashed password           |
| `createdAt` | Timestamp   | Record creation timestamp |
| `updatedAt` | Timestamp   | Last update timestamp     |

..other fields

### 2. Domains Table

Stores information about external projects.

| Field       | Type        | Description                              |
| ----------- | ----------- | ---------------------------------------- |
| `id`        | Primary Key | Unique identifier                        |
| `name`      | String      | Project name                             |
| `domain`    | String      | Domain name (e.g., `dashboard.app2.com`) |
| `apikey`    | String      | Unique key for the domain                |
| `createdAt` | Timestamp   | Record creation timestamp                |
| `updatedAt` | Timestamp   | Last update timestamp                    |

---

## API Endpoints

### 1. Login/Register

- **Endpoint**: `POST /login`
- **Parameters**:
  - `email`
  - `password`
  - `callbackUrl` (Query)
- **Response**: Redirect to `callbackUrl` with a token.

---

### 2. Validate Token

- **Endpoint**: `GET /validate-token`
- **Headers**:
  - `x-client-apikey`
- **Query Parameters**:
  - `token`
- **Response**:
  - `200 OK`: User data.
  - `401 Unauthorized`: Invalid token or `apikey`.

---

## Flow

### Redirection

1. User navigates to `auth.example.com/login?callbackUrl=https://dashboard.app2.com`.
2. The `callbackUrl` is validated against the **Domains** table.

### Authentication

1. User logs in/registers at `auth.example.com`.
2. A token is generated, stored in the database, and sent to the `callbackUrl`.

### API Validation

1. External projects use APIs to validate tokens using `x-client-apikey`.
2. The system matches the `apikey` and verifies the token.

---

## Token Management

- Tokens are stored in a `tokens` table with attributes:
  - `id`, `userId`, `token`, `createdAt`, `expiresAt`.
- Expired tokens are invalidated automatically.

---

## Security Measures

1. Hash sensitive data (e.g., passwords, tokens).
2. Use **HTTPS** for all communications.
3. Limit token validity with expiration timestamps.
4. Validate `x-client-apikey` to prevent unauthorized access.
