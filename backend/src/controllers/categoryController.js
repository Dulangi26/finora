import pool from "../db/database.js";


// ================= ADD CATEGORY =================
export const createCategory = async (req, res) => {
  try {
    const { name, type, color } = req.body;

    // Validation
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Name and type are required",
      });
    }

    // Insert category
    const [result] = await pool.query(
      `INSERT INTO categories 
       (user_id, name, type, color)
       VALUES (?, ?, ?, ?)`,
      [
        req.user.id,
        name,
        type,
        color || "#6366f1",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: {
        id: result.insertId,
        name,
        type,
        color: color || "#6366f1",
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= GET CATEGORIES =================
export const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      `SELECT * FROM categories
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      categories,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= UPDATE CATEGORY =================
export const updateCategory = async (req, res) => {
  try {
    const { name, type, color } = req.body;

    const { id } = req.params;

    // Check category exists
    const [categories] = await pool.query(
      `SELECT * FROM categories
       WHERE id = ? AND user_id = ?`,
      [id, req.user.id]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Update
    await pool.query(
      `UPDATE categories
       SET name = ?, type = ?, color = ?
       WHERE id = ?`,
      [name, type, color, id]
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= DELETE CATEGORY =================
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check category exists
    const [categories] = await pool.query(
      `SELECT * FROM categories
       WHERE id = ? AND user_id = ?`,
      [id, req.user.id]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Delete
    await pool.query(
      `DELETE FROM categories
       WHERE id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};