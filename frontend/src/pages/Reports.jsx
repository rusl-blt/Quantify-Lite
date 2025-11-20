import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Print, Download } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getSalesReport, getInventoryReport, getProfitReport } from '../services/api';

const Reports = () => {
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState(new Date());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      let data;
      const start = startDate.toISOString().split('T')[0];
      const end = endDate.toISOString().split('T')[0];

      if (tabValue === 0) {
        data = await getSalesReport(start, end);
      } else if (tabValue === 1) {
        data = await getInventoryReport();
      } else {
        data = await getProfitReport(start, end);
      }

      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (!reportData) return;

    const csvContent = convertToCSV(reportData);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report_${new Date().toISOString()}.csv`;
    link.click();
  };

  const convertToCSV = (data) => {
    if (!data || !data.details || data.details.length === 0) return '';

    const headers = Object.keys(data.details[0]).join(',');
    const rows = data.details.map(row =>
      Object.values(row).map(val =>
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',')
    );

    return [headers, ...rows].join('\n');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value || 0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Typography variant="h4" className="mb-6 font-bold text-gray-800">
          Reports
        </Typography>

        <Card className="mb-4 shadow-md">
          <CardContent>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="Sales Report" />
              <Tab label="Inventory Report" />
              <Tab label="Profit Report" />
            </Tabs>

            <Box className="mt-4">
              {tabValue !== 1 && (
                <Grid container spacing={2} className="mb-4">
                  <Grid item xs={12} sm={4}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} className="flex items-center">
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleGenerateReport}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Generate Report'}
                    </Button>
                  </Grid>
                </Grid>
              )}

              {tabValue === 1 && (
                <Box className="mb-4">
                  <Button
                    variant="contained"
                    onClick={handleGenerateReport}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Generate Report'}
                  </Button>
                </Box>
              )}

              {reportData && (
                <Box>
                  <Box className="flex justify-end gap-2 mb-4 no-print">
                    <Button
                      variant="outlined"
                      startIcon={<Print />}
                      onClick={handlePrint}
                    >
                      Print
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={handleExport}
                    >
                      Export CSV
                    </Button>
                  </Box>

                  <Grid container spacing={3} className="mb-4">
                    {reportData.summary && Object.entries(reportData.summary).map(([key, value]) => (
                      <Grid item xs={12} sm={6} md={3} key={key}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="body2" color="textSecondary">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Typography>
                            <Typography variant="h5" className="font-bold">
                              {typeof value === 'number' && key.includes('total') || key.includes('revenue') || key.includes('profit')
                                ? formatCurrency(value)
                                : value}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  {reportData.details && reportData.details.length > 0 && (
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            {Object.keys(reportData.details[0]).map((header) => (
                              <TableCell key={header}>
                                {header.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reportData.details.map((row, index) => (
                            <TableRow key={index}>
                              {Object.entries(row).map(([key, value], i) => (
                                <TableCell key={i}>
                                  {typeof value === 'number' && (key.includes('price') || key.includes('total') || key.includes('amount'))
                                    ? formatCurrency(value)
                                    : value}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              )}

              {!reportData && !loading && (
                <Box className="text-center py-8">
                  <Typography color="textSecondary">
                    Select date range and click "Generate Report" to view data
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default Reports;
