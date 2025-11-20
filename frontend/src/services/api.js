import axios from 'axios';

const API_BASE_URL = '/api';

// Dashboard APIs
export const getDashboardStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/stats`);
  return response.data;
};

export const getRevenueChart = async (days = 7) => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/revenue-chart?days=${days}`);
  return response.data;
};

// Product/Inventory APIs
export const getProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/products`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axios.post(`${API_BASE_URL}/products`, productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axios.put(`${API_BASE_URL}/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/products/${id}`);
  return response.data;
};

export const getLowStockProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/products/low-stock`);
  return response.data;
};

// Category APIs
export const getCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/categories`);
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await axios.post(`${API_BASE_URL}/categories`, categoryData);
  return response.data;
};

// Sales/POS APIs
export const createSale = async (saleData) => {
  const response = await axios.post(`${API_BASE_URL}/sales`, saleData);
  return response.data;
};

export const getSales = async (params) => {
  const response = await axios.get(`${API_BASE_URL}/sales`, { params });
  return response.data;
};

export const getSaleById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/sales/${id}`);
  return response.data;
};

// Reports APIs
export const getSalesReport = async (startDate, endDate) => {
  const response = await axios.get(`${API_BASE_URL}/reports/sales`, {
    params: { startDate, endDate }
  });
  return response.data;
};

export const getInventoryReport = async () => {
  const response = await axios.get(`${API_BASE_URL}/reports/inventory`);
  return response.data;
};

export const getProfitReport = async (startDate, endDate) => {
  const response = await axios.get(`${API_BASE_URL}/reports/profit`, {
    params: { startDate, endDate }
  });
  return response.data;
};

// User Management APIs
export const getUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/users`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/users`, userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await axios.put(`${API_BASE_URL}/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
  return response.data;
};

// Backup APIs
export const createBackup = async () => {
  const response = await axios.post(`${API_BASE_URL}/backup/create`);
  return response.data;
};

export const getBackups = async () => {
  const response = await axios.get(`${API_BASE_URL}/backup/list`);
  return response.data;
};

export const restoreBackup = async (filename) => {
  const response = await axios.post(`${API_BASE_URL}/backup/restore`, { filename });
  return response.data;
};

// Supplier APIs
export const getSuppliers = async () => {
  const response = await axios.get(`${API_BASE_URL}/suppliers`);
  return response.data;
};

export const createSupplier = async (supplierData) => {
  const response = await axios.post(`${API_BASE_URL}/suppliers`, supplierData);
  return response.data;
};

export const updateSupplier = async (id, supplierData) => {
  const response = await axios.put(`${API_BASE_URL}/suppliers/${id}`, supplierData);
  return response.data;
};

export const deleteSupplier = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/suppliers/${id}`);
  return response.data;
};
