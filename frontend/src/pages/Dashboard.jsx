import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  Inventory2,
  ShoppingCart,
} from '@mui/icons-material';
import { LineChart } from '@mui/x-charts/LineChart';
import { getDashboardStats, getRevenueChart } from '../services/api';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
    <CardContent>
      <Box className="flex items-center justify-between">
        <Box>
          <Typography variant="body2" color="textSecondary" className="mb-1">
            {title}
          </Typography>
          <Typography variant="h4" className="font-bold" style={{ color }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="textSecondary" className="mt-1">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          className="rounded-full p-3"
          style={{ backgroundColor: `${color}20` }}
        >
          {React.cloneElement(icon, { style: { color, fontSize: 40 } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, revenueData] = await Promise.all([
        getDashboardStats(),
        getRevenueChart(7),
      ]);

      setStats(statsData);
      setChartData(revenueData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-96">
        <CircularProgress />
      </Box>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value || 0);
  };

  return (
    <Box>
      <Typography variant="h4" className="mb-6 font-bold text-gray-800">
        Dashboard
      </Typography>

      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Revenue"
            value={formatCurrency(stats?.todayRevenue)}
            icon={<AttachMoney />}
            color="#4caf50"
            subtitle={`${stats?.todaySales || 0} sales today`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Profit"
            value={formatCurrency(stats?.todayProfit)}
            icon={<TrendingUp />}
            color="#2196f3"
            subtitle={`${stats?.profitMargin || 0}% margin`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Inventory Value (Purchase)"
            value={formatCurrency(stats?.totalInventoryPurchaseValue)}
            icon={<Inventory2 />}
            color="#ff9800"
            subtitle={`${stats?.totalProducts || 0} products`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Inventory Value (Selling)"
            value={formatCurrency(stats?.totalInventorySellingValue)}
            icon={<ShoppingCart />}
            color="#9c27b0"
            subtitle={`Potential: ${formatCurrency(stats?.potentialProfit || 0)}`}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper className="p-6 shadow-md">
            <Typography variant="h6" className="mb-4 font-semibold">
              Revenue Flow (Last 7 Days)
            </Typography>
            {chartData && chartData.labels && chartData.data ? (
              <LineChart
                xAxis={[
                  {
                    data: chartData.labels.map((_, index) => index),
                    scaleType: 'point',
                    valueFormatter: (value) => chartData.labels[value],
                  },
                ]}
                series={[
                  {
                    data: chartData.data,
                    label: 'Revenue',
                    color: '#2196f3',
                    curve: 'linear',
                  },
                ]}
                height={300}
                margin={{ top: 20, right: 20, bottom: 30, left: 60 }}
              />
            ) : (
              <Box className="flex justify-center items-center h-64">
                <Typography color="textSecondary">No data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper className="p-6 shadow-md h-full">
            <Typography variant="h6" className="mb-4 font-semibold">
              Quick Stats
            </Typography>
            <Box className="space-y-4">
              <Box className="border-b pb-3">
                <Typography variant="body2" color="textSecondary">
                  Low Stock Items
                </Typography>
                <Typography variant="h5" className="font-bold text-red-500">
                  {stats?.lowStockCount || 0}
                </Typography>
              </Box>
              <Box className="border-b pb-3">
                <Typography variant="body2" color="textSecondary">
                  Total Sales This Month
                </Typography>
                <Typography variant="h5" className="font-bold text-green-600">
                  {formatCurrency(stats?.monthRevenue)}
                </Typography>
              </Box>
              <Box className="border-b pb-3">
                <Typography variant="body2" color="textSecondary">
                  Total Customers
                </Typography>
                <Typography variant="h5" className="font-bold text-blue-600">
                  {stats?.totalCustomers || 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Total Products
                </Typography>
                <Typography variant="h5" className="font-bold text-purple-600">
                  {stats?.totalProducts || 0}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
