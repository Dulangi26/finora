import pool from "../db/database.js";

import {
  autoAllocateSavings,
} from "../utils/goalAllocator.js";

// ================= CREATE TRANSACTION =================
export const createTransaction = async (req, res) => {
  try {

    const {
      title,
      amount,
      type,
      category_id,
      date,
      note,
    } = req.body;

    // ================= VALIDATION =================
    if (
      !title ||
      !amount ||
      !type ||
      !date
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill required fields",
      });
    }

    // ================= INSERT =================
    const [result] = await pool.query(
      `
      INSERT INTO transactions
      (
        user_id,
        category_id,
        title,
        amount,
        type,
        date,
        note
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        req.user.id,
        category_id || null,
        title,
        amount,
        type,
        date,
        note || null,
      ]
    );

    // ================= AUTO GOAL ALLOCATION =================
    await autoAllocateSavings(req.user.id);

    // ================= RESPONSE =================
    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transactionId: result.insertId,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= GET TRANSACTIONS =================
export const getTransactions = async (req, res) => {
  try {

    const {
      type,
      category,
      startDate,
      endDate,
    } = req.query;

    let query = `
      SELECT
        t.*,
        c.name AS category_name,
        c.color AS category_color

      FROM transactions t

      LEFT JOIN categories c
      ON t.category_id = c.id

      WHERE t.user_id = ?
    `;

    const queryParams = [
      req.user.id,
    ];

    // ================= TYPE FILTER =================
    if (type) {
      query += ` AND t.type = ?`;

      queryParams.push(type);
    }

    // ================= CATEGORY FILTER =================
    if (category) {
      query += ` AND t.category_id = ?`;

      queryParams.push(category);
    }

    // ================= DATE FILTER =================
    if (startDate && endDate) {

      query += `
        AND t.date BETWEEN ? AND ?
      `;

      queryParams.push(
        startDate,
        endDate
      );
    }

    // ================= ORDER =================
    query += `
      ORDER BY t.date DESC
    `;

    const [transactions] =
      await pool.query(
        query,
        queryParams
      );

    res.status(200).json({
      success: true,
      transactions,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= UPDATE TRANSACTION =================
export const updateTransaction = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      title,
      amount,
      type,
      category_id,
      date,
      note,
    } = req.body;

    // ================= CHECK EXISTS =================
    const [transactions] =
      await pool.query(
        `
        SELECT *
        FROM transactions
        WHERE id = ?
        AND user_id = ?
        `,
        [
          id,
          req.user.id,
        ]
      );

    if (transactions.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // ================= UPDATE =================
    await pool.query(
      `
      UPDATE transactions

      SET
        title = ?,
        amount = ?,
        type = ?,
        category_id = ?,
        date = ?,
        note = ?

      WHERE id = ?
      `,
      [
        title,
        amount,
        type,
        category_id || null,
        date,
        note || null,
        id,
      ]
    );

    // ================= RECALCULATE GOALS =================
    await autoAllocateSavings(req.user.id);

    // ================= RESPONSE =================
    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= DELETE TRANSACTION =================
export const deleteTransaction = async (req, res) => {
  try {

    const { id } = req.params;

    // ================= CHECK EXISTS =================
    const [transactions] =
      await pool.query(
        `
        SELECT *
        FROM transactions
        WHERE id = ?
        AND user_id = ?
        `,
        [
          id,
          req.user.id,
        ]
      );

    if (transactions.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // ================= DELETE =================
    await pool.query(
      `
      DELETE FROM transactions
      WHERE id = ?
      `,
      [id]
    );

    // ================= RECALCULATE GOALS =================
    await autoAllocateSavings(req.user.id);

    // ================= RESPONSE =================
    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};