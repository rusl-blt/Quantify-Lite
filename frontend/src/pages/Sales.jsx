import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Autocomplete,
  Divider,
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  Print,
  Clear,
} from '@mui/icons-material';
import { getProducts, createSale } from '../services/api';

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [discount, setDiscount] = useState(0);
  const [openReceipt, setOpenReceipt] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.filter(p => p.stock_quantity > 0));
    } catch (error) {
      showAlert('Error fetching products', 'error');
    }
  };

  const showAlert = (message, severity = 'success') => {
    setAlert({ show: true, message, severity });
    setTimeout(() => setAlert({ show: false, message: '', severity: 'success' }), 3000);
  };

  const addToCart = () => {
    if (!selectedProduct) return;

    const existingItem = cart.find(item => item.product_id === selectedProduct.product_id);

    if (existingItem) {
      if (existingItem.quantity >= selectedProduct.stock_quantity) {
        showAlert('Not enough stock available', 'error');
        return;
      }
      setCart(cart.map(item =>
        item.product_id === selectedProduct.product_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        product_id: selectedProduct.product_id,
        product_name: selectedProduct.product_name,
        selling_price: selectedProduct.selling_price,
        quantity: 1,
        stock_quantity: selectedProduct.stock_quantity,
      }]);
    }
    setSelectedProduct(null);
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.product_id === productId) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) return item;
        if (newQuantity > item.stock_quantity) {
          showAlert('Not enough stock available', 'error');
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscount(0);
    setPaymentAmount('');
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.selling_price * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - discount;
  };

  const calculateChange = () => {
    const payment = parseFloat(paymentAmount) || 0;
    const total = calculateTotal();
    return payment - total;
  };

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      showAlert('Cart is empty', 'error');
      return;
    }

    const payment = parseFloat(paymentAmount) || 0;
    const total = calculateTotal();

    if (payment < total) {
      showAlert('Insufficient payment amount', 'error');
      return;
    }

    const saleData = {
      customer_name: customerName || 'Walk-in Customer',
      customer_phone: customerPhone || null,
      items: cart.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.selling_price,
      })),
      subtotal: calculateSubtotal(),
      discount: discount,
      total: total,
      payment_amount: payment,
      change_amount: calculateChange(),
    };

    try {
      const result = await createSale(saleData);
      setLastSale(result);
      setOpenReceipt(true);
      clearCart();
      fetchProducts(); // Refresh product list to update stock
      showAlert('Sale completed successfully', 'success');
    } catch (error) {
      showAlert(error.response?.data?.message || 'Error completing sale', 'error');
    }
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <Box>
      <Typography variant="h4" className="mb-6 font-bold text-gray-800">
        Point of Sale
      </Typography>

      {alert.show && (
        <Alert severity={alert.severity} className="mb-4">
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card className="shadow-md">
            <CardContent>
              <Typography variant="h6" className="mb-4 font-semibold">
                Add Products
              </Typography>

              <Box className="flex gap-2 mb-4">
                <Autocomplete
                  fullWidth
                  options={products}
                  getOptionLabel={(option) =>
                    `${option.product_name} - $${option.selling_price} (Stock: ${option.stock_quantity})`
                  }
                  value={selectedProduct}
                  onChange={(_, newValue) => setSelectedProduct(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Search Product" />
                  )}
                />
                <Button
                  variant="contained"
                  onClick={addToCart}
                  disabled={!selectedProduct}
                  startIcon={<Add />}
                >
                  Add
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography color="textSecondary">
                            Cart is empty
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      cart.map((item) => (
                        <TableRow key={item.product_id}>
                          <TableCell>{item.product_name}</TableCell>
                          <TableCell align="right">
                            ${item.selling_price.toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <Box className="flex items-center justify-center">
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.product_id, -1)}
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                              <Typography className="mx-2">{item.quantity}</Typography>
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.product_id, 1)}
                              >
                                <Add fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            ${(item.selling_price * item.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeFromCart(item.product_id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card className="shadow-md">
            <CardContent>
              <Typography variant="h6" className="mb-4 font-semibold">
                Payment Details
              </Typography>

              <TextField
                fullWidth
                label="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mb-3"
              />

              <TextField
                fullWidth
                label="Customer Phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="mb-4"
              />

              <Divider className="my-4" />

              <Box className="space-y-3">
                <Box className="flex justify-between">
                  <Typography>Subtotal:</Typography>
                  <Typography className="font-semibold">
                    ${calculateSubtotal().toFixed(2)}
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  label="Discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  inputProps={{ min: 0, step: 0.01 }}
                />

                <Box className="flex justify-between text-lg font-bold">
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="primary">
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  label="Payment Amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  inputProps={{ min: 0, step: 0.01 }}
                />

                {paymentAmount && (
                  <Box className="flex justify-between">
                    <Typography>Change:</Typography>
                    <Typography className={calculateChange() >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      ${calculateChange().toFixed(2)}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box className="mt-6 space-y-2">
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleCompleteSale}
                  startIcon={<ShoppingCart />}
                  disabled={cart.length === 0}
                >
                  Complete Sale
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={clearCart}
                  startIcon={<Clear />}
                >
                  Clear Cart
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openReceipt} onClose={() => setOpenReceipt(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Sale Receipt</DialogTitle>
        <DialogContent>
          {lastSale && (
            <Box className="space-y-2">
              <Typography variant="body2">Receipt #: {lastSale.sale_id}</Typography>
              <Typography variant="body2">
                Date: {new Date(lastSale.sale_date).toLocaleString()}
              </Typography>
              <Typography variant="body2">Customer: {lastSale.customer_name}</Typography>
              <Divider className="my-2" />
              <Typography variant="body2">Subtotal: ${lastSale.subtotal}</Typography>
              <Typography variant="body2">Discount: ${lastSale.discount}</Typography>
              <Typography variant="body2" className="font-bold">
                Total: ${lastSale.total}
              </Typography>
              <Typography variant="body2">Payment: ${lastSale.payment_amount}</Typography>
              <Typography variant="body2">Change: ${lastSale.change_amount}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={printReceipt} startIcon={<Print />}>
            Print
          </Button>
          <Button onClick={() => setOpenReceipt(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sales;
