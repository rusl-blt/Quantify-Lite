-- ============================================================
-- Quantify Lite - Inventory & POS Management System
-- Database Schema with Sample Data
-- ============================================================

-- Create database
CREATE DATABASE IF NOT EXISTS quantify_lite;
USE quantify_lite;

-- ============================================================
-- Table: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  role ENUM('admin', 'manager', 'cashier') DEFAULT 'cashier',
  phone VARCHAR(20),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Table: categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category_name (category_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Table: suppliers
-- ============================================================
CREATE TABLE IF NOT EXISTS suppliers (
  supplier_id INT PRIMARY KEY AUTO_INCREMENT,
  supplier_name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_supplier_name (supplier_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Table: products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  product_name VARCHAR(200) NOT NULL,
  category_id INT,
  supplier_id INT,
  barcode VARCHAR(50),
  purchase_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  stock_quantity INT NOT NULL DEFAULT 0,
  min_stock_level INT NOT NULL DEFAULT 10,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE SET NULL,
  INDEX idx_product_name (product_name),
  INDEX idx_barcode (barcode),
  INDEX idx_category (category_id),
  INDEX idx_supplier (supplier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Table: sales
-- ============================================================
CREATE TABLE IF NOT EXISTS sales (
  sale_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  customer_name VARCHAR(100),
  customer_phone VARCHAR(20),
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  payment_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  change_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  INDEX idx_sale_date (sale_date),
  INDEX idx_user (user_id),
  INDEX idx_customer (customer_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Table: sale_items
-- ============================================================
CREATE TABLE IF NOT EXISTS sale_items (
  sale_item_id INT PRIMARY KEY AUTO_INCREMENT,
  sale_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  FOREIGN KEY (sale_id) REFERENCES sales(sale_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id),
  INDEX idx_sale (sale_id),
  INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Insert Sample Data
-- ============================================================

-- Insert default admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (username, password, full_name, email, role, phone) VALUES
('admin', '$2a$10$KWcQDh/zzlsT9DKgwD2ArOh3SZzeccKrYpiO2.ixFYUSSHIaiOV.u', 'Administrator', 'admin@quantifylite.com', 'admin', '555-0001'),
('manager1', '$2a$10$KWcQDh/zzlsT9DKgwD2ArOh3SZzeccKrYpiO2.ixFYUSSHIaiOV.u', 'John Manager', 'manager@quantifylite.com', 'manager', '555-0002'),
('cashier1', '$2a$10$KWcQDh/zzlsT9DKgwD2ArOh3SZzeccKrYpiO2.ixFYUSSHIaiOV.u', 'Jane Cashier', 'cashier@quantifylite.com', 'cashier', '555-0003');

-- Insert categories
INSERT INTO categories (category_name, description) VALUES
('Fruits & Vegetables', 'Fresh fruits and vegetables'),
('Dairy Products', 'Milk, cheese, yogurt, and other dairy items'),
('Beverages', 'Soft drinks, juices, water, and other beverages'),
('Snacks', 'Chips, cookies, and other snack items'),
('Bakery', 'Bread, pastries, and baked goods'),
('Canned Goods', 'Canned fruits, vegetables, and other preserved items'),
('Household', 'Cleaning supplies and household items'),
('Personal Care', 'Toiletries and personal hygiene products'),
('Frozen Foods', 'Frozen meals, ice cream, and frozen vegetables'),
('Meat & Seafood', 'Fresh and packaged meat and seafood');

-- Insert suppliers
INSERT INTO suppliers (supplier_name, contact_person, email, phone, address) VALUES
('Fresh Farm Supplies', 'Robert Johnson', 'robert@freshfarm.com', '555-1001', '123 Farm Road, Rural County'),
('Dairy Delights Co.', 'Sarah Williams', 'sarah@dairydelights.com', '555-1002', '456 Milk Street, Dairy Town'),
('Beverage Distributors Inc.', 'Michael Brown', 'michael@bevdist.com', '555-1003', '789 Soda Avenue, Drink City'),
('Snack Masters Ltd.', 'Emily Davis', 'emily@snackmasters.com', '555-1004', '321 Chip Lane, Snack Valley'),
('Quality Meats & More', 'David Wilson', 'david@qualitymeats.com', '555-1005', '654 Butcher Boulevard, Meat Town');

-- Insert sample products
INSERT INTO products (product_name, category_id, supplier_id, barcode, purchase_price, selling_price, stock_quantity, min_stock_level, description) VALUES
-- Fruits & Vegetables
('Fresh Apples (1kg)', 1, 1, '1001001', 2.50, 3.99, 50, 10, 'Fresh red apples'),
('Bananas (1kg)', 1, 1, '1001002', 1.50, 2.49, 75, 15, 'Ripe yellow bananas'),
('Tomatoes (1kg)', 1, 1, '1001003', 2.00, 3.29, 40, 10, 'Fresh tomatoes'),
('Lettuce (head)', 1, 1, '1001004', 1.20, 1.99, 30, 10, 'Crisp lettuce head'),
('Potatoes (2kg)', 1, 1, '1001005', 3.00, 4.99, 60, 15, 'Quality potatoes'),

-- Dairy Products
('Whole Milk (1L)', 2, 2, '2001001', 1.80, 2.99, 100, 20, 'Fresh whole milk'),
('Cheddar Cheese (500g)', 2, 2, '2001002', 4.50, 6.99, 45, 10, 'Aged cheddar cheese'),
('Greek Yogurt (500g)', 2, 2, '2001003', 3.00, 4.99, 55, 15, 'Natural Greek yogurt'),
('Butter (250g)', 2, 2, '2001004', 2.50, 3.99, 40, 10, 'Unsalted butter'),
('Eggs (12 pack)', 2, 2, '2001005', 3.50, 5.49, 70, 20, 'Farm fresh eggs'),

-- Beverages
('Coca Cola (2L)', 3, 3, '3001001', 1.50, 2.79, 120, 30, 'Classic Coca Cola'),
('Orange Juice (1L)', 3, 3, '3001002', 2.50, 3.99, 60, 15, '100% pure orange juice'),
('Mineral Water (1.5L)', 3, 3, '3001003', 0.80, 1.49, 200, 50, 'Natural mineral water'),
('Green Tea (20 bags)', 3, 3, '3001004', 2.00, 3.49, 40, 10, 'Premium green tea'),
('Coffee Beans (500g)', 3, 3, '3001005', 8.00, 12.99, 25, 5, 'Arabica coffee beans'),

-- Snacks
('Potato Chips (200g)', 4, 4, '4001001', 1.50, 2.99, 80, 20, 'Classic salted chips'),
('Chocolate Bar (100g)', 4, 4, '4001002', 1.00, 1.99, 150, 30, 'Milk chocolate bar'),
('Cookies (300g)', 4, 4, '4001003', 2.50, 3.99, 60, 15, 'Chocolate chip cookies'),
('Peanuts (250g)', 4, 4, '4001004', 2.00, 3.49, 45, 10, 'Roasted peanuts'),
('Crackers (250g)', 4, 4, '4001005', 1.80, 2.99, 50, 10, 'Whole wheat crackers'),

-- Bakery
('White Bread (500g)', 5, 1, '5001001', 1.20, 2.29, 90, 20, 'Fresh white bread'),
('Whole Wheat Bread (500g)', 5, 1, '5001002', 1.50, 2.79, 75, 15, 'Whole wheat bread'),
('Croissant (4 pack)', 5, 1, '5001003', 3.00, 4.99, 35, 10, 'Butter croissants'),
('Bagels (6 pack)', 5, 1, '5001004', 2.50, 3.99, 40, 10, 'Plain bagels'),
('Muffins (4 pack)', 5, 1, '5001005', 3.50, 5.49, 30, 8, 'Blueberry muffins'),

-- Canned Goods
('Canned Tomatoes (400g)', 6, 1, '6001001', 0.90, 1.79, 100, 25, 'Diced tomatoes'),
('Canned Corn (340g)', 6, 1, '6001002', 0.80, 1.49, 95, 20, 'Sweet corn kernels'),
('Canned Tuna (185g)', 6, 5, '6001003', 2.00, 3.29, 80, 20, 'Tuna in spring water'),
('Canned Beans (400g)', 6, 1, '6001004', 0.85, 1.59, 90, 25, 'Red kidney beans'),
('Tomato Sauce (500g)', 6, 1, '6001005', 1.50, 2.49, 70, 15, 'Pasta sauce'),

-- Household
('Dish Soap (500ml)', 7, NULL, '7001001', 1.50, 2.99, 60, 15, 'Lemon scented'),
('Paper Towels (2 rolls)', 7, NULL, '7001002', 2.00, 3.49, 50, 10, 'Super absorbent'),
('Trash Bags (20 pack)', 7, NULL, '7001003', 3.00, 4.99, 40, 10, 'Heavy duty bags'),
('Laundry Detergent (1L)', 7, NULL, '7001004', 4.50, 7.99, 35, 8, 'Fresh scent'),
('All-Purpose Cleaner (750ml)', 7, NULL, '7001005', 2.50, 3.99, 45, 10, 'Multi-surface cleaner'),

-- Personal Care
('Shampoo (400ml)', 8, NULL, '8001001', 3.50, 5.99, 50, 10, 'For all hair types'),
('Toothpaste (100ml)', 8, NULL, '8001002', 2.00, 3.49, 70, 15, 'Mint flavor'),
('Bar Soap (125g)', 8, NULL, '8001003', 0.90, 1.79, 100, 25, 'Moisturizing soap'),
('Hand Sanitizer (250ml)', 8, NULL, '8001004', 2.50, 3.99, 60, 15, '70% alcohol'),
('Toilet Paper (4 rolls)', 8, NULL, '8001005', 3.00, 4.99, 80, 20, 'Soft and strong'),

-- Frozen Foods
('Frozen Pizza (400g)', 9, NULL, '9001001', 4.00, 6.99, 40, 10, 'Pepperoni pizza'),
('Ice Cream (1L)', 9, 2, '9001002', 3.50, 5.99, 55, 12, 'Vanilla ice cream'),
('Frozen Vegetables (500g)', 9, 1, '9001003', 2.00, 3.49, 65, 15, 'Mixed vegetables'),
('Frozen Chicken Nuggets (500g)', 9, 5, '9001004', 4.50, 7.49, 45, 10, 'Breaded nuggets'),
('Frozen French Fries (1kg)', 9, NULL, '9001005', 2.50, 3.99, 50, 12, 'Crispy fries'),

-- Meat & Seafood
('Chicken Breast (1kg)', 10, 5, '10001001', 6.00, 9.99, 30, 8, 'Fresh chicken breast'),
('Ground Beef (500g)', 10, 5, '10001002', 5.00, 7.99, 25, 5, 'Lean ground beef'),
('Salmon Fillet (500g)', 10, 5, '10001003', 10.00, 15.99, 20, 5, 'Fresh salmon'),
('Pork Chops (1kg)', 10, 5, '10001004', 7.00, 11.99, 22, 5, 'Center cut pork chops'),
('Shrimp (500g)', 10, 5, '10001005', 9.00, 14.99, 18, 5, 'Frozen peeled shrimp');

-- Insert sample sales data
INSERT INTO sales (user_id, customer_name, customer_phone, subtotal, discount, total, payment_amount, change_amount, sale_date) VALUES
-- Today's sales
(3, 'John Doe', '555-2001', 25.47, 0, 25.47, 30.00, 4.53, NOW()),
(3, 'Jane Smith', '555-2002', 45.96, 5.00, 40.96, 50.00, 9.04, NOW()),
(2, 'Bob Johnson', '555-2003', 18.75, 0, 18.75, 20.00, 1.25, NOW()),
(3, 'Walk-in Customer', NULL, 12.48, 0, 12.48, 15.00, 2.52, NOW()),

-- Yesterday's sales
(3, 'Mary Williams', '555-2004', 67.45, 10.00, 57.45, 60.00, 2.55, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 'Tom Brown', '555-2005', 32.97, 0, 32.97, 35.00, 2.03, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, 'Walk-in Customer', NULL, 8.97, 0, 8.97, 10.00, 1.03, DATE_SUB(NOW(), INTERVAL 1 DAY)),

-- 2 days ago
(3, 'Alice Davis', '555-2006', 54.92, 5.00, 49.92, 50.00, 0.08, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 'Charlie Wilson', '555-2007', 28.45, 0, 28.45, 30.00, 1.55, DATE_SUB(NOW(), INTERVAL 2 DAY)),

-- 3 days ago
(3, 'Emma Martinez', '555-2008', 39.84, 0, 39.84, 40.00, 0.16, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 'Walk-in Customer', NULL, 15.96, 0, 15.96, 20.00, 4.04, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Insert sale items for the sales above
-- Sale 1 items
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES
(1, 1, 2, 3.99, 7.98),
(1, 11, 3, 2.99, 8.97),
(1, 16, 2, 3.99, 7.98),
(1, 31, 1, 2.29, 2.29);

-- Sale 2 items
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES
(2, 6, 4, 2.99, 11.96),
(2, 7, 2, 6.99, 13.98),
(2, 21, 5, 2.99, 14.95),
(2, 26, 2, 2.49, 4.98);

-- Sale 3 items
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES
(3, 2, 3, 2.49, 7.47),
(3, 11, 2, 2.79, 5.58),
(3, 31, 2, 2.29, 4.58);

-- Sale 4 items
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES
(4, 16, 3, 3.99, 11.97),
(4, 41, 1, 1.79, 1.79);

-- Sale 5 items
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES
(5, 46, 3, 9.99, 29.97),
(5, 8, 5, 4.99, 24.95),
(5, 12, 4, 3.49, 13.96);

-- Sale 6 items
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES
(6, 3, 4, 2.79, 11.16),
(6, 21, 4, 2.99, 11.96),
(6, 22, 3, 1.99, 5.97),
(6, 31, 2, 2.29, 4.58);

-- Sale 7 items
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES
(7, 11, 3, 2.79, 8.37),
(7, 41, 2, 1.79, 3.58);

-- Sale 8 items
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES
(8, 6, 6, 2.99, 17.94),
(8, 13, 2, 3.49, 6.98),
(8, 46, 3, 9.99, 29.97);

-- Sale 9 items
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES
(9, 16, 4, 3.99, 15.96),
(9, 22, 5, 1.99, 9.95),
(9, 31, 1, 2.29, 2.29);

-- Sale 10 items
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES
(10, 1, 5, 3.99, 19.95),
(10, 11, 5, 2.79, 13.95),
(10, 21, 2, 2.99, 5.98);

-- Sale 11 items
INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES
(11, 6, 2, 2.99, 5.98),
(11, 46, 1, 9.99, 9.99);

-- ============================================================
-- Views for Reports (Optional but useful)
-- ============================================================

-- View: Product Inventory Summary
CREATE OR REPLACE VIEW view_product_inventory AS
SELECT
  p.product_id,
  p.product_name,
  c.category_name,
  s.supplier_name,
  p.stock_quantity,
  p.min_stock_level,
  p.purchase_price,
  p.selling_price,
  (p.stock_quantity * p.purchase_price) AS total_purchase_value,
  (p.stock_quantity * p.selling_price) AS total_selling_value,
  CASE
    WHEN p.stock_quantity = 0 THEN 'Out of Stock'
    WHEN p.stock_quantity <= p.min_stock_level THEN 'Low Stock'
    ELSE 'In Stock'
  END AS stock_status
FROM products p
LEFT JOIN categories c ON p.category_id = c.category_id
LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id;

-- View: Sales Summary
CREATE OR REPLACE VIEW view_sales_summary AS
SELECT
  s.sale_id,
  s.sale_date,
  u.username AS cashier,
  s.customer_name,
  s.subtotal,
  s.discount,
  s.total,
  COUNT(si.sale_item_id) AS items_count
FROM sales s
LEFT JOIN users u ON s.user_id = u.user_id
LEFT JOIN sale_items si ON s.sale_id = si.sale_id
GROUP BY s.sale_id;

-- ============================================================
-- Indexes for Performance
-- ============================================================

-- Additional indexes for better query performance
CREATE INDEX idx_sale_date_desc ON sales(sale_date DESC);
CREATE INDEX idx_product_stock ON products(stock_quantity);

-- ============================================================
-- Database Setup Complete
-- ============================================================

SELECT 'Database setup completed successfully!' AS Status;
SELECT COUNT(*) AS total_products FROM products;
SELECT COUNT(*) AS total_sales FROM sales;
SELECT COUNT(*) AS total_users FROM users;
