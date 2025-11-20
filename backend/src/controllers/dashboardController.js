const Sale = require('../models/Sale');
const Product = require('../models/Product');
const { pool } = require('../config/database');

exports.getDashboardStats = async (req, res) => {
  try {
    const todayStats = await Sale.getTodayStats();
    const todayProfit = await Sale.getTodayProfit();
    const inventoryValue = await Product.getTotalInventoryValue();
    const monthRevenue = await Sale.getMonthlyRevenue();

    // Get low stock count
    const [lowStockResult] = await pool.query(
      'SELECT COUNT(*) as count FROM products WHERE stock_quantity <= min_stock_level'
    );

    // Get total products count
    const [productsResult] = await pool.query('SELECT COUNT(*) as count FROM products');

    // Get total customers (unique customer names from sales)
    const [customersResult] = await pool.query(
      'SELECT COUNT(DISTINCT customer_name) as count FROM sales'
    );

    // Calculate profit margin
    const profitMargin = todayStats.total_revenue > 0
      ? ((todayProfit / todayStats.total_revenue) * 100).toFixed(2)
      : 0;

    // Calculate potential profit
    const potentialProfit = (inventoryValue.total_selling_value || 0) - (inventoryValue.total_purchase_value || 0);

    res.json({
      todayRevenue: todayStats.total_revenue || 0,
      todaySales: todayStats.total_sales || 0,
      todayProfit: todayProfit || 0,
      profitMargin: profitMargin,
      totalInventoryPurchaseValue: inventoryValue.total_purchase_value || 0,
      totalInventorySellingValue: inventoryValue.total_selling_value || 0,
      potentialProfit: potentialProfit,
      lowStockCount: lowStockResult[0].count,
      totalProducts: productsResult[0].count,
      totalCustomers: customersResult[0].count,
      monthRevenue: monthRevenue
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRevenueChart = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const data = await Sale.getRevenueChart(days);

    // Create array of last N days
    const labels = [];
    const values = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      labels.push(dayLabel);

      const dayData = data.find(d => d.date.toISOString().split('T')[0] === dateStr);
      values.push(dayData ? parseFloat(dayData.revenue) : 0);
    }

    res.json({
      labels: labels,
      data: values
    });
  } catch (error) {
    console.error('Revenue chart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
