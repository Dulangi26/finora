import pool from "../db/database.js";

// ============================================
// GET DASHBOARD DATA
// ============================================
export const getDashboardData = async (
  req,
  res
) => {

  console.log(
    "✅ Dashboard route hit"
  );

  try {

    const userId =
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Unauthorized",
      });
    }

    // ============================================
    // SUMMARY
    // ============================================
    const [summaryRows] =
      await pool.query(
        `
        SELECT
          COALESCE(
            SUM(
              CASE
                WHEN type = 'income'
                THEN amount
                ELSE 0
              END
            ),
            0
          ) AS totalIncome,

          COALESCE(
            SUM(
              CASE
                WHEN type = 'expense'
                THEN amount
                ELSE 0
              END
            ),
            0
          ) AS totalExpense

        FROM transactions

        WHERE user_id = ?
        `,
        [userId]
      );

    const income =
      Number(
        summaryRows?.[0]
          ?.totalIncome || 0
      );

    const expense =
      Number(
        summaryRows?.[0]
          ?.totalExpense || 0
      );

    const balance =
      income - expense;

    const savings =
      balance > 0
        ? balance
        : 0;

    // ============================================
    // MONTHLY ANALYTICS
    // FIXED
    // ============================================
    let monthlyRows = [];

    try {

      const [monthly] =
        await pool.query(
          `
          SELECT
            DATE_FORMAT(
              \`date\`,
              '%b'
            ) AS month,

            YEAR(\`date\`) AS year,

            MONTH(\`date\`) AS monthNumber,

            COALESCE(
              SUM(
                CASE
                  WHEN type = 'income'
                  THEN amount
                  ELSE 0
                END
              ),
              0
            ) AS income,

            COALESCE(
              SUM(
                CASE
                  WHEN type = 'expense'
                  THEN amount
                  ELSE 0
                END
              ),
              0
            ) AS expense

          FROM transactions

          WHERE
            user_id = ?
            AND \`date\` IS NOT NULL

          GROUP BY
            YEAR(\`date\`),
            MONTH(\`date\`)

          ORDER BY
            YEAR(\`date\`) ASC,
            MONTH(\`date\`) ASC
          `,
          [userId]
        );

      monthlyRows =
        monthly || [];

    } catch (err) {

      console.log(
        "MONTHLY ERROR:",
        err.message
      );
    }

    // ============================================
    // EXPENSE BREAKDOWN
    // FIXED
    // ============================================
    let expenseRows = [];

    try {

      const [expenses] =
        await pool.query(
          `
          SELECT
            COALESCE(
              c.name,
              'Other'
            ) AS name,

            YEAR(t.date) AS year,

            MONTH(t.date) AS month,

            DATE_FORMAT(
              t.date,
              '%b'
            ) AS monthName,

            COALESCE(
              SUM(t.amount),
              0
            ) AS value

          FROM transactions t

          LEFT JOIN categories c
          ON t.category_id = c.id

          WHERE
            t.user_id = ?
            AND t.type = 'expense'

          GROUP BY
            c.id,
            YEAR(t.date),
            MONTH(t.date)

          ORDER BY
            YEAR(t.date) DESC,
            MONTH(t.date) DESC,
            value DESC
          `,
          [userId]
        );

      expenseRows =
        expenses || [];

    } catch (err) {

      console.log(
        "EXPENSE ERROR:",
        err.message
      );
    }

    // ============================================
    // RECENT TRANSACTIONS
    // ============================================
    let transactionRows = [];

    try {

      const [transactions] =
        await pool.query(
          `
          SELECT
            t.*,
            c.name AS category_name,
            c.color AS category_color

          FROM transactions t

          LEFT JOIN categories c
          ON t.category_id = c.id

          WHERE t.user_id = ?

          ORDER BY t.\`date\` DESC

          LIMIT 3
          `,
          [userId]
        );

      transactionRows =
        transactions || [];

    } catch (err) {

      console.log(
        "TRANSACTION ERROR:",
        err.message
      );
    }

    // ============================================
    // ALL TRANSACTIONS
    // IMPORTANT FIX
    // ============================================
    let allTransactions = [];

    try {

      const [allTx] =
        await pool.query(
          `
          SELECT
            t.*,
            c.name AS category_name,
            c.color AS category_color

          FROM transactions t

          LEFT JOIN categories c
          ON t.category_id = c.id

          WHERE t.user_id = ?

          ORDER BY t.date ASC
          `,
          [userId]
        );

      allTransactions =
        allTx || [];

    } catch (err) {

      console.log(
        "ALL TRANSACTION ERROR:",
        err.message
      );
    }

    // ============================================
    // GOALS
    // ============================================
    let goals = [];

    try {

      const [goalRows] =
        await pool.query(
          `
          SELECT
            id,
            title,
            target_amount,
            current_amount,
            status

          FROM goals

          WHERE user_id = ?

          ORDER BY id DESC

          LIMIT 3
          `,
          [userId]
        );

      goals =
        goalRows.map((goal) => {

          const target =
            Number(
              goal.target_amount ||
                0
            );

          const current =
            Number(
              goal.current_amount ||
                0
            );

          return {
            ...goal,

            progress:
              target > 0
                ? Math.min(
                    (
                      current /
                      target
                    ) * 100,
                    100
                  )
                : 0,
          };
        });

    } catch (err) {

      console.log(
        "GOALS ERROR:",
        err.message
      );
    }

    // ============================================
    // FINAL RESPONSE
    // ============================================
    res.status(200).json({
      success: true,

      summary: {
        income,
        expense,
        balance,
        savings,
      },

      // FIXED ANALYTICS
      monthly: monthlyRows,

      // FIXED EXPENSES
      expenses: expenseRows,

      // RECENT ONLY
      transactions:
        transactionRows,

      // ALL HISTORY
      allTransactions,

      goals,
    });

  } catch (error) {

    console.log(
      "❌ DASHBOARD ERROR"
    );

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to load dashboard",
    });
  }
};