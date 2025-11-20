import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Warning,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import {
  getProducts,
  getCategories,
  getSuppliers,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/api';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    product_name: '',
    category_id: '',
    supplier_id: '',
    barcode: '',
    purchase_price: '',
    selling_price: '',
    stock_quantity: '',
    min_stock_level: '',
    description: '',
  });
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData, suppliersData] = await Promise.all([
        getProducts(),
        getCategories(),
        getSuppliers(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
    } catch (error) {
      showAlert('Error fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, severity = 'success') => {
    setAlert({ show: true, message, severity });
    setTimeout(() => setAlert({ show: false, message: '', severity: 'success' }), 3000);
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setEditMode(true);
    } else {
      setCurrentProduct({
        product_name: '',
        category_id: '',
        supplier_id: '',
        barcode: '',
        purchase_price: '',
        selling_price: '',
        stock_quantity: '',
        min_stock_level: '',
        description: '',
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProduct({
      product_name: '',
      category_id: '',
      supplier_id: '',
      barcode: '',
      purchase_price: '',
      selling_price: '',
      stock_quantity: '',
      min_stock_level: '',
      description: '',
    });
  };

  const handleSaveProduct = async () => {
    try {
      if (editMode) {
        await updateProduct(currentProduct.product_id, currentProduct);
        showAlert('Product updated successfully');
      } else {
        await createProduct(currentProduct);
        showAlert('Product added successfully');
      }
      handleCloseDialog();
      fetchData();
    } catch (error) {
      showAlert(error.response?.data?.message || 'Error saving product', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        showAlert('Product deleted successfully');
        fetchData();
      } catch (error) {
        showAlert(error.response?.data?.message || 'Error deleting product', 'error');
      }
    }
  };

  const columns = [
    { field: 'product_id', headerName: 'ID', width: 70 },
    { field: 'product_name', headerName: 'Product Name', width: 200 },
    { field: 'barcode', headerName: 'Barcode', width: 130 },
    { field: 'category_name', headerName: 'Category', width: 130 },
    { field: 'supplier_name', headerName: 'Supplier', width: 150 },
    {
      field: 'purchase_price',
      headerName: 'Purchase Price',
      width: 130,
      valueFormatter: (params) => `$${params.value?.toFixed(2) || '0.00'}`,
    },
    {
      field: 'selling_price',
      headerName: 'Selling Price',
      width: 130,
      valueFormatter: (params) => `$${params.value?.toFixed(2) || '0.00'}`,
    },
    {
      field: 'stock_quantity',
      headerName: 'Stock',
      width: 100,
      renderCell: (params) => {
        const isLowStock = params.value <= params.row.min_stock_level;
        return (
          <Box className="flex items-center">
            {isLowStock && (
              <Tooltip title="Low Stock">
                <Warning className="text-red-500 mr-1" fontSize="small" />
              </Tooltip>
            )}
            <Chip
              label={params.value}
              color={isLowStock ? 'error' : 'success'}
              size="small"
            />
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleOpenDialog(params.row)}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteProduct(params.row.product_id)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          Inventory Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Product
        </Button>
      </Box>

      {alert.show && (
        <Alert severity={alert.severity} className="mb-4">
          {alert.message}
        </Alert>
      )}

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={products}
          columns={columns}
          getRowId={(row) => row.product_id}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          loading={loading}
          sx={{
            backgroundColor: 'white',
            '& .MuiDataGrid-cell': {
              fontSize: '0.875rem',
            },
          }}
        />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Box className="grid grid-cols-2 gap-4 mt-2">
            <TextField
              fullWidth
              label="Product Name"
              value={currentProduct.product_name}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, product_name: e.target.value })
              }
              required
            />

            <TextField
              fullWidth
              label="Barcode"
              value={currentProduct.barcode}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, barcode: e.target.value })
              }
            />

            <TextField
              fullWidth
              select
              label="Category"
              value={currentProduct.category_id}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, category_id: e.target.value })
              }
              required
            >
              {categories.map((cat) => (
                <MenuItem key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              select
              label="Supplier"
              value={currentProduct.supplier_id}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, supplier_id: e.target.value })
              }
            >
              {suppliers.map((sup) => (
                <MenuItem key={sup.supplier_id} value={sup.supplier_id}>
                  {sup.supplier_name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Purchase Price"
              type="number"
              value={currentProduct.purchase_price}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, purchase_price: e.target.value })
              }
              inputProps={{ min: 0, step: 0.01 }}
              required
            />

            <TextField
              fullWidth
              label="Selling Price"
              type="number"
              value={currentProduct.selling_price}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, selling_price: e.target.value })
              }
              inputProps={{ min: 0, step: 0.01 }}
              required
            />

            <TextField
              fullWidth
              label="Stock Quantity"
              type="number"
              value={currentProduct.stock_quantity}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, stock_quantity: e.target.value })
              }
              inputProps={{ min: 0 }}
              required
            />

            <TextField
              fullWidth
              label="Minimum Stock Level"
              type="number"
              value={currentProduct.min_stock_level}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, min_stock_level: e.target.value })
              }
              inputProps={{ min: 0 }}
              required
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={currentProduct.description}
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, description: e.target.value })
              }
              className="col-span-2"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;
