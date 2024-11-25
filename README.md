# Centralized Authentication System: Documentation

## Project Overview

A centralized authentication system using **Next.js** and **MySQL** to manage user authentication for multiple external projects.

---

## Key Features

### Login/Registration Redirection

- External projects redirect users to `auth.example.com` with a param `source`.
  - Example: `auth.example.com/v0/signin?source=dashboard.app2.com`.
- The system checks if the `source` is registered in the database.

### Validate Session (Get User Details)

- **Endpoint**: `GET /api/auth/verify-session`
- **Headers**:
  - `x-api-key`
- **Query Parameters**:
  - `sessionId` and `source`
- **Response**:
  - `200 OK`: User data.
  - `401 Unauthorized`: Invalid token or `apikey`.

---

### For Signout user

- **Endpoint**: `GET /api/auth/signout`
- **Headers**:
  - `x-api-key`
- **Query Parameters**:
  - `sessionId` and `source`
- **Response**:
  - `200 OK`: User Signout.

---

## Postman Collection

[API Endpoint Links](https://github.com/manishthakur-dotix/dotix-auth/blob/master/Dotix-Auth.postman_collection.json)
