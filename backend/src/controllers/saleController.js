const Sale = require('../models/Sale');

exports.createSale = async (req, res) => {
  try {
    const { items, ...saleData } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in sale' });
    }

    const sale = await Sale.create(saleData, items, req.user.userId);
    res.status(201).json(sale);
  } catch (error) {
    console.error('Create sale error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.json(sale);
  } catch (error) {
    console.error('Get sale error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllSales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const sales = await Sale.getAll({ startDate, endDate });
    res.json(sales);
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
