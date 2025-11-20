import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Divider,
} from '@mui/material';
import { Print, Save } from '@mui/icons-material';

const Printer = () => {
  const [settings, setSettings] = useState({
    receiptHeader: 'Quantify Lite (QL)',
    shopName: 'Your Store Name',
    shopAddress: '123 Main Street',
    shopPhone: '(555) 123-4567',
    taxRate: '0',
    printFooter: 'Thank you for your business!',
    paperSize: '80mm',
    autoPrint: false,
  });

  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  const showAlert = (message, severity = 'success') => {
    setAlert({ show: true, message, severity });
    setTimeout(() => setAlert({ show: false, message: '', severity: 'success' }), 3000);
  };

  const handleSave = () => {
    localStorage.setItem('printerSettings', JSON.stringify(settings));
    showAlert('Printer settings saved successfully');
  };

  const handleTestPrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Test Receipt</title>
          <style>
            body {
              font-family: monospace;
              width: ${settings.paperSize === '80mm' ? '302px' : '226px'};
              margin: 0 auto;
              padding: 10px;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            hr { border: 1px dashed #000; }
          </style>
        </head>
        <body>
          <div class="center bold">${settings.receiptHeader}</div>
          <div class="center">${settings.shopName}</div>
          <div class="center">${settings.shopAddress}</div>
          <div class="center">${settings.shopPhone}</div>
          <hr>
          <div class="center">TEST RECEIPT</div>
          <div>Date: ${new Date().toLocaleString()}</div>
          <hr>
          <div>Item 1 .................. $10.00</div>
          <div>Item 2 .................. $15.00</div>
          <hr>
          <div class="bold">TOTAL: $25.00</div>
          <hr>
          <div class="center">${settings.printFooter}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    showAlert('Test receipt sent to printer');
  };

  return (
    <Box>
      <Typography variant="h4" className="mb-6 font-bold text-gray-800">
        Printer Settings
      </Typography>

      {alert.show && (
        <Alert severity={alert.severity} className="mb-4">
          {alert.message}
        </Alert>
      )}

      <Card className="shadow-md">
        <CardContent>
          <Typography variant="h6" className="mb-4 font-semibold">
            Receipt Configuration
          </Typography>

          <Box className="space-y-4">
            <TextField
              fullWidth
              label="Receipt Header"
              value={settings.receiptHeader}
              onChange={(e) =>
                setSettings({ ...settings, receiptHeader: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Shop Name"
              value={settings.shopName}
              onChange={(e) =>
                setSettings({ ...settings, shopName: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Shop Address"
              value={settings.shopAddress}
              onChange={(e) =>
                setSettings({ ...settings, shopAddress: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Shop Phone"
              value={settings.shopPhone}
              onChange={(e) =>
                setSettings({ ...settings, shopPhone: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Tax Rate (%)"
              type="number"
              value={settings.taxRate}
              onChange={(e) =>
                setSettings({ ...settings, taxRate: e.target.value })
              }
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              fullWidth
              label="Receipt Footer"
              value={settings.printFooter}
              onChange={(e) =>
                setSettings({ ...settings, printFooter: e.target.value })
              }
            />

            <Divider />

            <FormControl component="fieldset">
              <FormLabel component="legend">Paper Size</FormLabel>
              <RadioGroup
                value={settings.paperSize}
                onChange={(e) =>
                  setSettings({ ...settings, paperSize: e.target.value })
                }
              >
                <FormControlLabel value="80mm" control={<Radio />} label="80mm (Standard)" />
                <FormControlLabel value="58mm" control={<Radio />} label="58mm (Small)" />
              </RadioGroup>
            </FormControl>

            <Box className="flex gap-2 mt-6">
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
              >
                Save Settings
              </Button>
              <Button
                variant="outlined"
                startIcon={<Print />}
                onClick={handleTestPrint}
              >
                Test Print
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card className="shadow-md mt-4">
        <CardContent>
          <Typography variant="h6" className="mb-2 font-semibold">
            Receipt Preview
          </Typography>
          <Box
            className="border border-gray-300 p-4 bg-white"
            style={{
              width: settings.paperSize === '80mm' ? '302px' : '226px',
              fontFamily: 'monospace',
            }}
          >
            <div className="text-center font-bold">{settings.receiptHeader}</div>
            <div className="text-center">{settings.shopName}</div>
            <div className="text-center">{settings.shopAddress}</div>
            <div className="text-center">{settings.shopPhone}</div>
            <hr className="my-2 border-dashed" />
            <div>Receipt #: 001</div>
            <div>Date: {new Date().toLocaleString()}</div>
            <hr className="my-2 border-dashed" />
            <div>Sample Item 1 .......... $10.00</div>
            <div>Sample Item 2 .......... $15.00</div>
            <hr className="my-2 border-dashed" />
            <div className="font-bold">TOTAL: $25.00</div>
            <hr className="my-2 border-dashed" />
            <div className="text-center">{settings.printFooter}</div>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Printer;
