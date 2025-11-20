const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findByUsername(username) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT user_id, username, full_name, email, role, phone, status FROM users WHERE user_id = ?',
      [id]
    );
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.query(
      'SELECT user_id, username, full_name, email, role, phone, status FROM users ORDER BY user_id DESC'
    );
    return rows;
  }

  static async create(userData) {
    const { username, password, full_name, email, role, phone } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (username, password, full_name, email, role, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, full_name, email, role, phone]
    );

    return result.insertId;
  }

  static async update(id, userData) {
    const { full_name, email, role, phone, password } = userData;

    let query = 'UPDATE users SET full_name = ?, email = ?, role = ?, phone = ?';
    let params = [full_name, email, role, phone];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE user_id = ?';
    params.push(id);

    const [result] = await pool.query(query, params);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
