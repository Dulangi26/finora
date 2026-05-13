-- =========================================
-- FINORA: Personal Finance App Database
-- =========================================

CREATE DATABASE IF NOT EXISTS finance_app;
USE finance_app;

-- =========================================
-- 1. USERS TABLE
-- =========================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 2. CATEGORIES TABLE
-- =========================================
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  color VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================
-- 3. GOALS TABLE
-- =========================================
CREATE TABLE goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,

  title VARCHAR(150) NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,

  start_date DATE,
  target_date DATE,

  status ENUM('active', 'completed', 'paused') DEFAULT 'active',
  priority INT DEFAULT 1,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================
-- 4. TRANSACTIONS TABLE
-- =========================================
CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  goal_id INT DEFAULT NULL,

  title VARCHAR(150) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  date DATE NOT NULL,
  note TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL
);

-- =========================================
-- 5. BUDGETS TABLE
-- =========================================
CREATE TABLE budgets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,

  amount DECIMAL(10,2) NOT NULL,
  period ENUM('monthly', 'yearly') NOT NULL,
  month INT,
  year INT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- =========================================
-- 6. GOAL CONTRIBUTIONS TABLE
-- =========================================
CREATE TABLE goal_contributions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  goal_id INT NOT NULL,

  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);

-- =========================================
-- INDEXES (Performance Optimization)
-- =========================================

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_budgets_user ON budgets(user_id);
CREATE INDEX idx_categories_user ON categories(user_id);
CREATE INDEX idx_goals_user ON goals(user_id);