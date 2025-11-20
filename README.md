# Quantify Lite (QL)

**A Budget-Friendly Inventory Management & POS System for Grocery Stores**

Quantify Lite is a comprehensive, full-stack web application designed to help small to medium-sized grocery stores manage their inventory and sales operations efficiently while keeping costs low.

## Features

### Core Functionality
- **User Authentication** - Secure login system with role-based access control
- **Dashboard** - Real-time metrics and analytics including:
  - Today's revenue and profit
  - Total inventory value (purchase & selling price)
  - Revenue flow graph (last 7 days)
  - Low stock alerts
  - Quick stats overview

### Sales & POS
- **Point of Sale System** - Fast and intuitive checkout process
- **Customer Management** - Track customer information
- **Receipt Generation** - Print-ready receipts
- **Payment Handling** - Calculate change automatically
- **Discount Management** - Apply discounts to sales

### Inventory Management
- **Product Management** - Add, edit, delete products
- **Category Management** - Organize products by categories
- **Supplier Management** - Track supplier information
- **Stock Tracking** - Real-time stock levels
- **Low Stock Alerts** - Automatic notifications for low inventory
- **Barcode Support** - Track products with barcodes

### Reports
- **Sales Reports** - Detailed sales analysis by date range
- **Inventory Reports** - Stock valuation and status
- **Profit Reports** - Profit margins and analysis
- **Export Functionality** - Export reports to CSV

### Settings
- **User Management** - Add and manage system users (Admin, Manager, Cashier)
- **Printer Configuration** - Configure receipt printer settings
- **Database Backup** - Create and restore database backups

## Technology Stack

### Frontend
- **Vite.js** - Fast build tool
- **React 18** - UI framework
- **React Router** - Navigation
- **Material-UI (MUI)** - Component library
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **MUI X Charts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **MVC Architecture** - Clean code organization

## Project Structure

```
Quantify-Lite/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   └── Layout.jsx   # Main layout with sidebar
│   │   ├── pages/           # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Sales.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── settings/
│   │   │       ├── Users.jsx
│   │   │       ├── Printer.jsx
│   │   │       └── Backup.jsx
│   │   ├── context/         # React context
│   │   │   └── AuthContext.jsx
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   ├── styles/          # CSS files
│   │   └── App.jsx          # Main app component
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   │   └── database.js
│   │   ├── controllers/     # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── productController.js
│   │   │   ├── saleController.js
│   │   │   ├── userController.js
│   │   │   ├── categoryController.js
│   │   │   ├── supplierController.js
│   │   │   ├── reportController.js
│   │   │   └── backupController.js
│   │   ├── models/          # Data models
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Sale.js
│   │   │   ├── Category.js
│   │   │   └── Supplier.js
│   │   ├── routes/          # API routes
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── sales.js
│   │   │   ├── dashboard.js
│   │   │   ├── users.js
│   │   │   ├── categories.js
│   │   │   ├── suppliers.js
│   │   │   ├── reports.js
│   │   │   └── backup.js
│   │   └── middleware/      # Custom middleware
│   │       └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── database/
    └── quantify_lite.sql    # Database schema & sample data
```

## Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **WAMP Server** (for Windows) or **XAMPP** - [Download WAMP](https://www.wampserver.com/)
- **MySQL** (included with WAMP/XAMPP)
- **Git** (optional) - [Download](https://git-scm.com/)

### Step 1: Clone or Download the Project

```bash
git clone <repository-url>
cd Quantify-Lite
```

Or download and extract the ZIP file.

### Step 2: Database Setup

1. **Start WAMP Server**
   - Launch WAMP and ensure all services are running (green icon)

2. **Import Database**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Click on "New" to create a new database
   - Click on "Import" tab
   - Choose the file: `database/quantify_lite.sql`
   - Click "Go" to import

   The database will be created with:
   - All necessary tables
   - Sample products (50 items)
   - Sample categories and suppliers
   - Sample sales data
   - 3 test users

### Step 3: Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Open `backend/.env` file
   - Update the following if needed:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=           # Leave empty if no password
   DB_NAME=quantify_lite
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The backend should start on http://localhost:5000

### Step 4: Frontend Setup

1. **Open a new terminal and navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend should start on http://localhost:3000

### Step 5: Access the Application

1. Open your browser and go to: **http://localhost:3000**

2. **Login with default credentials:**

   | Username  | Password  | Role     |
   |-----------|-----------|----------|
   | admin     | admin123  | Admin    |
   | manager1  | admin123  | Manager  |
   | cashier1  | admin123  | Cashier  |

## User Roles & Permissions

### Admin
- Full access to all features
- Can manage users
- Can access backup/restore functions
- Can view all reports

### Manager
- Can manage inventory
- Can create/edit products
- Can view reports
- Can manage sales
- Can create users (limited)

### Cashier
- Can process sales
- Can view products
- Limited access to reports
- Cannot manage users or system settings

## Default Login Credentials

**Important:** Change these credentials after first login!

- **Username:** admin
- **Password:** admin123

## Features Guide

### Making a Sale
1. Go to **Sales** from the sidebar
2. Search and add products to cart
3. Enter customer details (optional)
4. Enter payment amount
5. Click "Complete Sale"
6. Print receipt if needed

### Managing Inventory
1. Go to **Inventory** from the sidebar
2. Click "Add Product" to add new items
3. Click edit icon to modify existing products
4. Products with low stock show warning indicators

### Viewing Reports
1. Go to **Reports** from the sidebar
2. Select report type (Sales/Inventory/Profit)
3. Choose date range
4. Click "Generate Report"
5. Export to CSV or print

### Creating Backups
1. Go to **Settings > Backup**
2. Click "Create Backup"
3. Backups are stored in `backend/backups/` folder
4. Use phpMyAdmin for manual import/export

## Troubleshooting

### Database Connection Error
- Ensure WAMP/XAMPP is running
- Check MySQL service is started
- Verify credentials in `backend/.env`
- Ensure database `quantify_lite` exists

### Port Already in Use
- **Backend (5000):** Change PORT in `backend/.env`
- **Frontend (3000):** Change port in `frontend/vite.config.js`

### Cannot Login
- Verify database has users table with data
- Check browser console for errors
- Ensure backend server is running

### Products Not Showing
- Check if products exist in database
- Verify API connection (check browser network tab)
- Ensure you're logged in

## Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

### Environment Variables
Update the following for production:
- Change `JWT_SECRET` to a strong random string
- Update `CORS_ORIGIN` to your production domain
- Use a strong database password

### Security Recommendations
1. Change all default passwords
2. Use environment variables for sensitive data
3. Enable HTTPS in production
4. Implement rate limiting
5. Regular database backups
6. Keep dependencies updated

## Support & Contributing

### Report Issues
If you encounter any issues, please check:
1. All services are running
2. Database is properly imported
3. Dependencies are installed
4. Environment variables are correct

### Future Enhancements
- Customer loyalty program
- Barcode scanning with camera
- Multi-store support
- Advanced analytics
- Mobile app
- Email notifications
- Invoice generation

## License

This project is open-source and available for educational and commercial use.

## Credits

Developed with modern web technologies to provide an affordable solution for small grocery stores.

---

**Quantify Lite** - Elevate Your Business, Keep It Budget-Friendly!
