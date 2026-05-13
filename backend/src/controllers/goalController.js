import pool from "../db/database.js";


// ======================================
// GET ALL GOALS
// ======================================
export const getGoals = async (req, res) => {

  try {

    const [goals] = await pool.query(
      `
      SELECT *
      FROM goals
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    const formattedGoals = goals.map((goal) => {

      const currentAmount =
        Number(goal.current_amount || 0);

      const targetAmount =
        Number(goal.target_amount || 0);

      const progress =
        targetAmount > 0
          ? (currentAmount / targetAmount) * 100
          : 0;

      return {
        ...goal,

        progress: Math.min(progress, 100),

        isCompleted:
          currentAmount >= targetAmount,
      };
    });

    res.status(200).json({
      success: true,
      goals: formattedGoals,
    });

  } catch (error) {

    console.log("GET GOALS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load goals",
    });
  }
};


// ======================================
// CREATE GOAL
// ======================================
export const createGoal = async (req, res) => {

  try {

    const {
      title,
      target_amount,
      current_amount,
      start_date,
      target_date,
    } = req.body;

    // VALIDATION
    if (!title || !target_amount) {

      return res.status(400).json({
        success: false,
        message:
          "Title and target amount are required",
      });
    }

    const targetAmount =
      Number(target_amount);

    const currentAmount =
      Number(current_amount || 0);

    const status =
      currentAmount >= targetAmount
        ? "completed"
        : "active";

    const [result] = await pool.query(
      `
      INSERT INTO goals
      (
        user_id,
        title,
        target_amount,
        current_amount,
        start_date,
        target_date,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        req.user.id,
        title,
        targetAmount,
        currentAmount,
        start_date || null,
        target_date || null,
        status,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Goal created successfully",
      goalId: result.insertId,
    });

  } catch (error) {

    console.log("CREATE GOAL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create goal",
      error: error.message,
    });
  }
};


// ======================================
// UPDATE GOAL
// ======================================
export const updateGoal = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      title,
      target_amount,
      current_amount,
      start_date,
      target_date,
    } = req.body;

    const [existing] = await pool.query(
      `
      SELECT *
      FROM goals
      WHERE id = ?
      AND user_id = ?
      `,
      [id, req.user.id]
    );

    if (existing.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    const targetAmount =
      Number(target_amount);

    const currentAmount =
      Number(current_amount || 0);

    const status =
      currentAmount >= targetAmount
        ? "completed"
        : "active";

    await pool.query(
      `
      UPDATE goals
      SET
        title = ?,
        target_amount = ?,
        current_amount = ?,
        start_date = ?,
        target_date = ?,
        status = ?
      WHERE id = ?
      `,
      [
        title,
        targetAmount,
        currentAmount,
        start_date || null,
        target_date || null,
        status,
        id,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Goal updated successfully",
    });

  } catch (error) {

    console.log("UPDATE GOAL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update goal",
    });
  }
};


// ======================================
// DELETE GOAL
// ======================================
export const deleteGoal = async (req, res) => {

  try {

    const { id } = req.params;

    const [existing] = await pool.query(
      `
      SELECT *
      FROM goals
      WHERE id = ?
      AND user_id = ?
      `,
      [id, req.user.id]
    );

    if (existing.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    await pool.query(
      `
      DELETE FROM goals
      WHERE id = ?
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
    });

  } catch (error) {

    console.log("DELETE GOAL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete goal",
    });
  }
};


// ======================================
// AUTO ALLOCATE SAVINGS
// ======================================
export const allocateSavingsToGoals = async (req, res) => {

  try {

    const userId = req.user.id;

    // ======================================
    // TOTAL INCOME
    // ======================================
    const [[income]] = await pool.query(
      `
      SELECT SUM(amount) AS totalIncome
      FROM transactions
      WHERE user_id = ?
      AND type = 'income'
      `,
      [userId]
    );

    // ======================================
    // TOTAL EXPENSE
    // ======================================
    const [[expense]] = await pool.query(
      `
      SELECT SUM(amount) AS totalExpense
      FROM transactions
      WHERE user_id = ?
      AND type = 'expense'
      `,
      [userId]
    );

    const totalIncome =
      Number(income.totalIncome || 0);

    const totalExpense =
      Number(expense.totalExpense || 0);

    const savings =
      totalIncome - totalExpense;

    // ======================================
    // ACTIVE GOALS
    // ======================================
    const [goals] = await pool.query(
      `
      SELECT *
      FROM goals
      WHERE user_id = ?
      AND status = 'active'
      ORDER BY target_date ASC
      `,
      [userId]
    );

    let remainingSavings = savings;

    for (const goal of goals) {

      if (remainingSavings <= 0) {
        break;
      }

      const currentAmount =
        Number(goal.current_amount || 0);

      const targetAmount =
        Number(goal.target_amount || 0);

      const needed =
        targetAmount - currentAmount;

      if (needed <= 0) {
        continue;
      }

      const contribution = Math.min(
        needed,
        remainingSavings
      );

      const updatedAmount =
        currentAmount + contribution;

      const updatedStatus =
        updatedAmount >= targetAmount
          ? "completed"
          : "active";

      await pool.query(
        `
        UPDATE goals
        SET
          current_amount = ?,
          status = ?
        WHERE id = ?
        `,
        [
          updatedAmount,
          updatedStatus,
          goal.id,
        ]
      );

      remainingSavings -= contribution;
    }

    res.status(200).json({
      success: true,
      message:
        "Savings allocated successfully",
      totalIncome,
      totalExpense,
      savings,
    });

  } catch (error) {

    console.log(
      "ALLOCATE SAVINGS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to allocate savings",
    });
  }
};