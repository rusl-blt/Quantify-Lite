const { pool } = require('../config/database');

class Sale {
  static async create(saleData, items, userId) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const { customer_name, customer_phone, subtotal, discount, total, payment_amount, change_amount } = saleData;

      // Insert sale record
      const [saleResult] = await connection.query(
        `INSERT INTO sales
         (user_id, customer_name, customer_phone, subtotal, discount, total, payment_amount, change_amount)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, customer_name, customer_phone, subtotal, discount, total, payment_amount, change_amount]
      );

      const saleId = saleResult.insertId;

      // Insert sale items and update stock
      for (const item of items) {
        // Insert sale item
        await connection.query(
          `INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
           VALUES (?, ?, ?, ?, ?)`,
          [saleId, item.product_id, item.quantity, item.unit_price, item.quantity * item.unit_price]
        );

        // Update product stock
        await connection.query(
          'UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?',
          [item.quantity, item.product_id]
        );

        // Check if stock is sufficient
        const [product] = await connection.query(
          'SELECT stock_quantity FROM products WHERE product_id = ?',
          [item.product_id]
        );

        if (product[0].stock_quantity < 0) {
          throw new Error('Insufficient stock for one or more products');
        }
      }

      await connection.commit();

      return this.findById(saleId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const [sales] = await pool.query(`
      SELECT s.*, u.username
      FROM sales s
      LEFT JOIN users u ON s.user_id = u.user_id
      WHERE s.sale_id = ?
    `, [id]);

    if (sales.length === 0) return null;

    const sale = sales[0];

    const [items] = await pool.query(`
      SELECT si.*, p.product_name
      FROM sale_items si
      JOIN products p ON si.product_id = p.product_id
      WHERE si.sale_id = ?
    `, [id]);

    sale.items = items;
    return sale;
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT s.*, u.username
      FROM sales s
      LEFT JOIN users u ON s.user_id = u.user_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.startDate) {
      query += ' AND DATE(s.sale_date) >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND DATE(s.sale_date) <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY s.sale_date DESC';

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async getTodayStats() {
    const [rows] = await pool.query(`
      SELECT
        COUNT(*) as total_sales,
        COALESCE(SUM(total), 0) as total_revenue,
        COALESCE(SUM(total - discount), 0) as net_revenue
      FROM sales
      WHERE DATE(sale_date) = CURDATE()
    `);
    return rows[0];
  }

  static async getTodayProfit() {
    const [rows] = await pool.query(`
      SELECT
        COALESCE(SUM(si.subtotal - (p.purchase_price * si.quantity)), 0) as profit
      FROM sale_items si
      JOIN sales s ON si.sale_id = s.sale_id
      JOIN products p ON si.product_id = p.product_id
      WHERE DATE(s.sale_date) = CURDATE()
    `);
    return rows[0].profit || 0;
  }

  static async getRevenueChart(days = 7) {
    const [rows] = await pool.query(`
      SELECT
        DATE(sale_date) as date,
        COALESCE(SUM(total), 0) as revenue
      FROM sales
      WHERE sale_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(sale_date)
      ORDER BY date ASC
    `, [days]);

    return rows;
  }

  static async getMonthlyRevenue() {
    const [rows] = await pool.query(`
      SELECT COALESCE(SUM(total), 0) as revenue
      FROM sales
      WHERE MONTH(sale_date) = MONTH(CURDATE())
      AND YEAR(sale_date) = YEAR(CURDATE())
    `);
    return rows[0].revenue || 0;
  }
}

module.exports = Sale;
