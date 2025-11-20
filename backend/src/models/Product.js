const { pool } = require('../config/database');

class Product {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT p.*, c.category_name, s.supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      ORDER BY p.product_id DESC
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(`
      SELECT p.*, c.category_name, s.supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      WHERE p.product_id = ?
    `, [id]);
    return rows[0];
  }

  static async getLowStock() {
    const [rows] = await pool.query(`
      SELECT p.*, c.category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.stock_quantity <= p.min_stock_level
      ORDER BY p.stock_quantity ASC
    `);
    return rows;
  }

  static async create(productData) {
    const {
      product_name, category_id, supplier_id, barcode,
      purchase_price, selling_price, stock_quantity,
      min_stock_level, description
    } = productData;

    const [result] = await pool.query(
      `INSERT INTO products
      (product_name, category_id, supplier_id, barcode, purchase_price,
       selling_price, stock_quantity, min_stock_level, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [product_name, category_id, supplier_id, barcode, purchase_price,
       selling_price, stock_quantity, min_stock_level, description]
    );

    return result.insertId;
  }

  static async update(id, productData) {
    const {
      product_name, category_id, supplier_id, barcode,
      purchase_price, selling_price, stock_quantity,
      min_stock_level, description
    } = productData;

    const [result] = await pool.query(
      `UPDATE products SET
       product_name = ?, category_id = ?, supplier_id = ?, barcode = ?,
       purchase_price = ?, selling_price = ?, stock_quantity = ?,
       min_stock_level = ?, description = ?
       WHERE product_id = ?`,
      [product_name, category_id, supplier_id, barcode, purchase_price,
       selling_price, stock_quantity, min_stock_level, description, id]
    );

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM products WHERE product_id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async updateStock(id, quantity) {
    const [result] = await pool.query(
      'UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?',
      [quantity, id]
    );
    return result.affectedRows > 0;
  }

  static async getTotalInventoryValue() {
    const [rows] = await pool.query(`
      SELECT
        SUM(stock_quantity * purchase_price) as total_purchase_value,
        SUM(stock_quantity * selling_price) as total_selling_value
      FROM products
    `);
    return rows[0];
  }
}

module.exports = Product;
