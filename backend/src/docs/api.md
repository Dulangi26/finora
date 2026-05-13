# Finora App API Documentation

## Base URL

```bash
http://localhost:5000/api
```

---

# Authentication

## Register User

### Endpoint

```http
POST /auth/register
```

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### Response

```json
{
  "message": "User registered successfully",
  "token": "jwt_token"
}
```

---

## Login User

### Endpoint

```http
POST /auth/login
```

### Request Body

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

### Response

```json
{
  "token": "jwt_token",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

# Transactions

## Get All Transactions

### Endpoint

```http
GET /transactions
```

### Headers

```http
Authorization: Bearer <token>
```

### Response

```json
[
  {
    "_id": "1",
    "title": "Salary",
    "amount": 75000,
    "type": "income",
    "category": "Salary",
    "date": "2026-01-01"
  }
]
```

---

## Create Transaction

### Endpoint

```http
POST /transactions
```

### Request Body

```json
{
  "title": "Groceries",
  "amount": 5000,
  "type": "expense",
  "category": "Food",
  "date": "2026-01-10",
  "note": "Weekly shopping"
}
```

### Response

```json
{
  "message": "Transaction added successfully"
}
```

---

## Update Transaction

### Endpoint

```http
PUT /transactions/:id
```

---

## Delete Transaction

### Endpoint

```http
DELETE /transactions/:id
```

---

# Budgets

## Get Budgets

### Endpoint

```http
GET /budgets
```

---

## Create Budget

### Endpoint

```http
POST /budgets
```

### Request Body

```json
{
  "category": "Food",
  "amount": 15000,
  "month": "2026-01"
}
```

---

## Update Budget

### Endpoint

```http
PUT /budgets/:id
```

---

## Delete Budget

### Endpoint

```http
DELETE /budgets/:id
```

---

# Categories

## Get Categories

### Endpoint

```http
GET /categories
```

---

## Create Category

### Endpoint

```http
POST /categories
```

### Request Body

```json
{
  "name": "Transport",
  "type": "expense"
}
```

---

## Update Category

### Endpoint

```http
PUT /categories/:id
```

---

## Delete Category

### Endpoint

```http
DELETE /categories/:id
```

---

# Dashboard

## Get Dashboard Summary

### Endpoint

```http
GET /dashboard/summary
```

### Response

```json
{
  "totalIncome": 100000,
  "totalExpense": 45000,
  "balance": 55000
}
```

---

# Error Responses

## Unauthorized

```json
{
  "message": "Unauthorized access"
}
```

## Validation Error

```json
{
  "message": "Validation failed"
}
```

---

# Authentication Notes

- JWT Authentication is used
- Protected routes require Bearer token
- Tokens expire after login session timeout

---

# Tech Stack

## Frontend
- React
- Tailwind CSS
- Framer Motion

## Backend
- Node.js
- Express.js
- MongoDB

---

# API Testing

Recommended tools:
- Postman
- Thunder Client
- Insomnia