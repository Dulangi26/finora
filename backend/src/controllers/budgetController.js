import pool from "../db/database.js";


// ================= CREATE BUDGET =================
export const createBudget = async (req, res) => {
  try {
    const {
      category_id,
      amount,
      period,
      month,
      year,
    } = req.body;

    // Validation
    if (!category_id || !amount) {
      return res.status(400).json({
        success: false,
        message: "Category and amount are required",
      });
    }

    // Insert budget
    const [result] = await pool.query(
      `INSERT INTO budgets
       (
         user_id,
         category_id,
         amount,
         period,
         month,
         year
       )
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        category_id,
        amount,
        period || "monthly",
        month || null,
        year || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Budget created successfully",
      budgetId: result.insertId,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// ================= GET BUDGETS =================
export const getBudgets = async (req, res) => {
  try {

    const [budgets] = await pool.query(
      `
      SELECT
        b.*,

        c.name AS category_name,
        c.color AS category_color,

        COALESCE(
          (
            SELECT SUM(t.amount)

            FROM transactions t

            WHERE
              t.category_id = b.category_id
              AND t.user_id = b.user_id
              AND t.type = 'expense'

              -- MONTH FILTER
              AND (
                b.period != 'monthly'
                OR (
                  MONTH(t.date) = b.month
                  AND YEAR(t.date) = b.year
                )
              )

              -- YEAR FILTER
              AND (
                b.period != 'yearly'
                OR YEAR(t.date) = b.year
              )

          ),
          0
        ) AS spent

      FROM budgets b

      LEFT JOIN categories c
      ON b.category_id = c.id

      WHERE b.user_id = ?

      ORDER BY b.created_at DESC
      `,
      [req.user.id]
    );

    // =========================
    // FORMAT
    // =========================
    const formattedBudgets = budgets.map((budget) => {

      const spent = Number(budget.spent || 0);

      const amount = Number(budget.amount || 0);

      const remaining = amount - spent;

      const percentage =
        amount > 0
          ? Math.min(
              (spent / amount) * 100,
              100
            )
          : 0;

      return {
        ...budget,

        spent,

        remaining,

        percentage: Number(
          percentage.toFixed(1)
        ),

        exceeded: spent > amount,
      };
    });

    res.status(200).json({
      success: true,
      budgets: formattedBudgets,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// ================= UPDATE BUDGET =================
export const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      category_id,
      amount,
      period,
      month,
      year,
    } = req.body;

    // Check exists
    const [budgets] = await pool.query(
      `SELECT * FROM budgets
       WHERE id = ? AND user_id = ?`,
      [id, req.user.id]
    );

    if (budgets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    // Update
    await pool.query(
      `UPDATE budgets
       SET
         category_id = ?,
         amount = ?,
         period = ?,
         month = ?,
         year = ?
       WHERE id = ?`,
      [
        category_id,
        amount,
        period,
        month,
        year,
        id,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Budget updated successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// ================= DELETE BUDGET =================
export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    // Check exists
    const [budgets] = await pool.query(
      `SELECT * FROM budgets
       WHERE id = ? AND user_id = ?`,
      [id, req.user.id]
    );

    if (budgets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    // Delete
    await pool.query(
      `DELETE FROM budgets
       WHERE id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};