-- =========================================
-- FINORA SEED DATA ( DEMO DATA)
-- =========================================

USE finance_app;

-- =========================================
-- 1. USERS
-- =========================================
INSERT INTO users (name, email, password)
VALUES
('Dulangika Malankande', 'dula@example.com', '$2b$10$hashedpassword1'),
('John Silva', 'john@example.com', '$2b$10$hashedpassword2');

-- =========================================
-- 2. CATEGORIES
-- =========================================
INSERT INTO categories (user_id, name, type, color)
VALUES
(1, 'Salary', 'income', '#22c55e'),
(1, 'Freelance', 'income', '#10b981'),
(1, 'Food', 'expense', '#ef4444'),
(1, 'Transport', 'expense', '#f97316'),
(1, 'Rent', 'expense', '#3b82f6'),
(1, 'Entertainment', 'expense', '#a855f7');

-- =========================================
-- 3. GOALS ( FINANCIAL GOALS)
-- =========================================
INSERT INTO goals (
  user_id, title, target_amount, current_amount,
  start_date, target_date, status, priority
)
VALUES
-- Emergency Fund
(1, 'Emergency Fund', 500000.00, 125000.00,
 '2025-01-01', '2026-12-31', 'active', 1),

-- Buy Laptop
(1, 'MacBook Pro M3', 750000.00, 300000.00,
 '2025-03-01', '2025-12-31', 'active', 2),

-- Travel Goal
(1, 'Japan Trip', 1200000.00, 450000.00,
 '2025-02-01', '2026-06-30', 'active', 2),

-- Car Savings
(1, 'Toyota Aqua Car', 3500000.00, 800000.00,
 '2024-10-01', '2027-12-31', 'active', 1),

-- Education Fund
(1, 'Master’s Degree Fund', 2000000.00, 1500000.00,
 '2024-01-01', '2026-01-01', 'active', 1);

-- =========================================
-- 4. TRANSACTIONS (SAMPLE FLOW)
-- =========================================
INSERT INTO transactions (
  user_id, category_id, goal_id,
  title, amount, type, date, note
)
VALUES
-- Income
(1, 1, NULL, 'Monthly Salary - April', 250000.00, 'income', '2026-04-30', 'Monthly company salary'),
(1, 2, NULL, 'Freelance Website Project', 85000.00, 'income', '2026-04-20', 'Upwork client payment'),

-- Expenses
(1, 3, NULL, 'Groceries - Keells', 15000.00, 'expense', '2026-05-01', 'Weekly groceries'),
(1, 4, NULL, 'Bus + Fuel', 8000.00, 'expense', '2026-05-02', 'Transport costs'),
(1, 5, NULL, 'Apartment Rent', 60000.00, 'expense', '2026-05-01', 'Monthly rent'),
(1, 6, NULL, 'Netflix Subscription', 4500.00, 'expense', '2026-05-03', 'Entertainment'),

-- Goal Contributions (linked savings)
(1, 1, 1, 'Emergency Fund Contribution', 50000.00, 'expense', '2026-04-10', 'Monthly saving deposit'),
(1, 1, 2, 'Laptop Savings Deposit', 100000.00, 'expense', '2026-04-15', 'Saved for MacBook'),
(1, 1, 3, 'Japan Trip Savings', 75000.00, 'expense', '2026-04-18', 'Travel fund contribution');

-- =========================================
-- 5. BUDGETS (MONTHLY LIMITS)
-- =========================================
INSERT INTO budgets (
  user_id, category_id, amount, period, month, year
)
VALUES
(1, 3, 60000.00, 'monthly', 5, 2026), -- Food budget
(1, 4, 20000.00, 'monthly', 5, 2026), -- Transport budget
(1, 5, 80000.00, 'monthly', 5, 2026), -- Rent budget
(1, 6, 15000.00, 'monthly', 5, 2026); -- Entertainment budget

