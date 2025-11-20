const { pool } = require('../config/database');

exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const [sales] = await pool.query(`
      SELECT
        s.sale_id,
        s.sale_date,
        s.customer_name,
        s.total,
        s.discount,
        s.payment_amount,
        u.username as cashier
      FROM sales s
      LEFT JOIN users u ON s.user_id = u.user_id
      WHERE DATE(s.sale_date) BETWEEN ? AND ?
      ORDER BY s.sale_date DESC
    `, [startDate, endDate]);

    const [summary] = await pool.query(`
      SELECT
        COUNT(*) as total_sales,
        SUM(total) as total_revenue,
        SUM(discount) as total_discount,
        AVG(total) as average_sale
      FROM sales
      WHERE DATE(sale_date) BETWEEN ? AND ?
    `, [startDate, endDate]);

    res.json({
      summary: summary[0],
      details: sales
    });
  } catch (error) {
    console.error('Sales report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getInventoryReport = async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT
        p.product_id,
        p.product_name,
        c.category_name,
        s.supplier_name,
        p.stock_quantity,
        p.min_stock_level,
        p.purchase_price,
        p.selling_price,
        (p.stock_quantity * p.purchase_price) as total_purchase_value,
        (p.stock_quantity * p.selling_price) as total_selling_value,
        CASE
          WHEN p.stock_quantity <= p.min_stock_level THEN 'Low Stock'
          WHEN p.stock_quantity = 0 THEN 'Out of Stock'
          ELSE 'In Stock'
        END as stock_status
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      ORDER BY p.product_name ASC
    `);

    const [summary] = await pool.query(`
      SELECT
        COUNT(*) as total_products,
        SUM(stock_quantity) as total_items,
        SUM(stock_quantity * purchase_price) as total_purchase_value,
        SUM(stock_quantity * selling_price) as total_selling_value,
        COUNT(CASE WHEN stock_quantity <= min_stock_level THEN 1 END) as low_stock_count
      FROM products
    `);

    res.json({
      summary: summary[0],
      details: products
    });
  } catch (error) {
    console.error('Inventory report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfitReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const [profitData] = await pool.query(`
      SELECT
        DATE(s.sale_date) as date,
        COUNT(DISTINCT s.sale_id) as total_sales,
        SUM(si.subtotal) as revenue,
        SUM(si.quantity * p.purchase_price) as cost,
        SUM(si.subtotal - (si.quantity * p.purchase_price)) as profit
      FROM sales s
      JOIN sale_items si ON s.sale_id = si.sale_id
      JOIN products p ON si.product_id = p.product_id
      WHERE DATE(s.sale_date) BETWEEN ? AND ?
      GROUP BY DATE(s.sale_date)
      ORDER BY date DESC
    `, [startDate, endDate]);

    const [summary] = await pool.query(`
      SELECT
        COUNT(DISTINCT s.sale_id) as total_sales,
        SUM(si.subtotal) as total_revenue,
        SUM(si.quantity * p.purchase_price) as total_cost,
        SUM(si.subtotal - (si.quantity * p.purchase_price)) as total_profit
      FROM sales s
      JOIN sale_items si ON s.sale_id = si.sale_id
      JOIN products p ON si.product_id = p.product_id
      WHERE DATE(s.sale_date) BETWEEN ? AND ?
    `, [startDate, endDate]);

    res.json({
      summary: summary[0],
      details: profitData
    });
  } catch (error) {
    console.error('Profit report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
