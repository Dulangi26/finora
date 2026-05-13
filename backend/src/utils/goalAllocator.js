import pool from "../db/database.js";

// ======================================
// AUTO ALLOCATE SAVINGS TO GOALS
// ======================================
export const autoAllocateSavings = async (userId) => {
  try {

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

    // ======================================
    // SAVINGS
    // ======================================
    const savings =
      totalIncome - totalExpense;

    console.log("Income:", totalIncome);
    console.log("Expense:", totalExpense);
    console.log("Savings:", savings);

    // ======================================
    // RESET GOALS
    // ======================================
    await pool.query(
      `
      UPDATE goals
      SET
        current_amount = 0,
        status = 'active'
      WHERE user_id = ?
      `,
      [userId]
    );

    // no savings
    if (savings <= 0) {
      return;
    }

    // ======================================
    // GET GOALS
    // ======================================
    const [goals] = await pool.query(
      `
      SELECT *
      FROM goals
      WHERE user_id = ?
      ORDER BY priority DESC,
               target_date ASC
      `,
      [userId]
    );

    let remainingSavings = savings;

    // ======================================
    // ALLOCATE
    // ======================================
    for (const goal of goals) {

      if (remainingSavings <= 0) {
        break;
      }

      const targetAmount =
        Number(goal.target_amount);

      const currentAmount =
        Number(goal.current_amount || 0);

      const neededAmount =
        targetAmount - currentAmount;

      if (neededAmount <= 0) {
        continue;
      }

      const contribution = Math.min(
        neededAmount,
        remainingSavings
      );

      const updatedAmount =
        currentAmount + contribution;

      const status =
        updatedAmount >= targetAmount
          ? "completed"
          : "active";

      // ======================================
      // UPDATE GOAL
      // ======================================
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
          status,
          goal.id,
        ]
      );

      console.log(
        `Goal ${goal.title} received Rs.${contribution}`
      );

      remainingSavings -= contribution;
    }

    console.log(
      "✅ Goal allocation completed"
    );

  } catch (error) {

    console.log(
      "❌ Goal Allocation Error:",
      error
    );
  }
};