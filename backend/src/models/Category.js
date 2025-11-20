const { pool } = require('../config/database');

class Category {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY category_name ASC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM categories WHERE category_id = ?', [id]);
    return rows[0];
  }

  static async create(categoryData) {
    const { category_name, description } = categoryData;
    const [result] = await pool.query(
      'INSERT INTO categories (category_name, description) VALUES (?, ?)',
      [category_name, description]
    );
    return result.insertId;
  }

  static async update(id, categoryData) {
    const { category_name, description } = categoryData;
    const [result] = await pool.query(
      'UPDATE categories SET category_name = ?, description = ? WHERE category_id = ?',
      [category_name, description, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM categories WHERE category_id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Category;
