const { pool } = require('../config/database');

class Supplier {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM suppliers ORDER BY supplier_name ASC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM suppliers WHERE supplier_id = ?', [id]);
    return rows[0];
  }

  static async create(supplierData) {
    const { supplier_name, contact_person, email, phone, address } = supplierData;
    const [result] = await pool.query(
      'INSERT INTO suppliers (supplier_name, contact_person, email, phone, address) VALUES (?, ?, ?, ?, ?)',
      [supplier_name, contact_person, email, phone, address]
    );
    return result.insertId;
  }

  static async update(id, supplierData) {
    const { supplier_name, contact_person, email, phone, address } = supplierData;
    const [result] = await pool.query(
      'UPDATE suppliers SET supplier_name = ?, contact_person = ?, email = ?, phone = ?, address = ? WHERE supplier_id = ?',
      [supplier_name, contact_person, email, phone, address, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM suppliers WHERE supplier_id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Supplier;
