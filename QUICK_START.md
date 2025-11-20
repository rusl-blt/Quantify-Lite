# Quick Start Guide - Quantify Lite

This guide will help you get Quantify Lite up and running in just a few minutes!

## Prerequisites Checklist

Before you begin, make sure you have:
- [ ] WAMP Server installed and running (green icon in system tray)
- [ ] Node.js installed (check with `node --version` in terminal)
- [ ] Database imported (see step 1 below)

## 5-Minute Setup

### Step 1: Import Database (2 minutes)

1. Start WAMP Server
2. Open browser and go to: **http://localhost/phpmyadmin**
3. Click "Import" tab
4. Click "Choose File" and select: `database/quantify_lite.sql`
5. Click "Go" button at the bottom
6. Wait for "Import has been successfully finished" message

### Step 2: Start Backend (1 minute)

Open terminal/command prompt in the project folder:

```bash
cd backend
npm install
npm start
```

Wait for the message: "✓ Database connected successfully"

### Step 3: Start Frontend (1 minute)

Open a NEW terminal/command prompt in the project folder:

```bash
cd frontend
npm install
npm run dev
```

Wait for the message showing the local URL (http://localhost:3000)

### Step 4: Login (1 minute)

1. Open browser to: **http://localhost:3000**
2. Login with:
   - Username: `admin`
   - Password: `admin123`

## That's It!

You should now see the dashboard with sample data.

## Quick Test

To verify everything is working:

1. **Check Dashboard** - You should see revenue, profit, and inventory stats
2. **Go to Inventory** - You should see 50 sample products
3. **Go to Sales** - Try making a test sale
4. **Check Reports** - Generate a sales report

## Common Issues & Quick Fixes

### "Cannot connect to database"
- ✓ Check if WAMP is running (green icon)
- ✓ Check if MySQL service is started in WAMP
- ✓ Verify database name is `quantify_lite` in phpMyAdmin

### "Port 5000 already in use"
- Change port in `backend/.env` file:
  ```
  PORT=5001
  ```

### "Port 3000 already in use"
- The Vite dev server will automatically try port 3001

### "Cannot find module"
- Run `npm install` again in that folder

### Database is empty
- Re-import the SQL file from phpMyAdmin

## Next Steps

1. **Change default password** - Go to Settings > Users
2. **Add your products** - Go to Inventory > Add Product
3. **Configure printer** - Go to Settings > Printer
4. **Make your first sale** - Go to Sales

## Need Help?

Check the main README.md file for detailed documentation.

## Default Users

| Username  | Password  | Role    |
|-----------|-----------|---------|
| admin     | admin123  | Admin   |
| manager1  | admin123  | Manager |
| cashier1  | admin123  | Cashier |

---

**Happy Selling! 🎉**
