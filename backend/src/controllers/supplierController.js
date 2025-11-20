const Supplier = require('../models/Supplier');

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.getAll();
    res.json(suppliers);
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const supplierId = await Supplier.create(req.body);
    const supplier = await Supplier.findById(supplierId);
    res.status(201).json(supplier);
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    const updated = await Supplier.update(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const supplier = await Supplier.findById(req.params.id);
    res.json(supplier);
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const deleted = await Supplier.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
