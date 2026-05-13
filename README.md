# Finora - Personal Finance & Budget Tracking Application

Finora is a full-stack personal finance management web application that helps users track income, expenses, budgets, and financial insights through an interactive dashboard.

The application provides secure authentication, transaction management, budget tracking, category management, and visual financial analytics.

---

# Features

## Authentication
- User Registration
- User Login & Logout
- JWT Authentication
- Protected Routes
- Password Encryption

---

## Transaction Management
- Add Income & Expenses
- Edit Transactions
- Delete Transactions
- Filter Transactions
- Transaction History

---

## Budget Management
- Create Monthly Budgets
- Track Budget Usage
- Budget Progress Indicators
- Overspending Alerts

---

## Category Management
- Create Categories
- Edit Categories
- Delete Categories
- Income & Expense Categories

---

## Dashboard Analytics
- Total Income
- Total Expenses
- Current Balance
- Expense Distribution Charts
- Monthly Financial Overview
- Recent Transactions

---

# Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- React Router DOM
- Recharts

---

## Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt.js

---

## Database
- MySQL

---

# Project Structure

```txt
personal-finance-app/
│
├── frontend/
├── backend/
├── database/
├── docs/
├── README.md
└── .gitignore
```

---

# Installation Guide

## 1. Clone Repository

```bash
git clone https://github.com/your-username/finora.git
cd finora
```

---

# Frontend Setup

## 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 3. Run Frontend

```bash
npm run dev
```

Frontend will run on:

```txt
http://localhost:5173
```

---

# Backend Setup

## 4. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 5. Configure Environment Variables

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=finora_db
JWT_SECRET=your_secret_key
```

---

## 6. Run Backend

```bash
npm run dev
```

Backend server will run on:

```txt
http://localhost:5000
```

---

# Database Setup

## 7. Create MySQL Database

Open MySQL and run:

```sql
CREATE DATABASE finora_db;
```

---

## 8. Import Database Schema

Import the SQL schema file:

```bash
database/schema.sql
```

You can use:
- MySQL Workbench
- phpMyAdmin
- Command Line

---

## 9. Optional Seed Data

Import sample data:

```bash
database/seed.sql
```

---

# API Documentation

API endpoint documentation is available in:

```txt
docs/api-docs.md
```

---

# ER Diagram

Database ER diagram:

```txt
database/er-diagram.png
```

---

# Demo Credentials

```txt
Email: demo@finora.com
Password: 123456
```

---

# Scripts

## Frontend

```bash
npm run dev
npm run build
npm run preview
```

## Backend

```bash
npm run dev
npm start
```

---

# Security Features

- JWT Authentication
- Password Hashing
- Protected API Routes
- Environment Variable Protection

---

# Future Improvements

- Export Financial Reports
- Email Notifications
- AI-based Expense Insights
- Multi-Currency Support
- Dark Mode
- Mobile Application

---

# Author

Developed as part of the Technical Assignment:
Personal Finance & Budget Tracking Application

Application Name: Finora

---

# License

This project is developed for educational and assessment purposes.