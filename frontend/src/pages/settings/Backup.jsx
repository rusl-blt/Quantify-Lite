import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
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
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { Backup as BackupIcon, Restore, Delete, Download } from '@mui/icons-material';
import { createBackup, getBackups, restoreBackup } from '../../services/api';

const Backup = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      const data = await getBackups();
      setBackups(data);
    } catch (error) {
      showAlert('Error fetching backups', 'error');
    }
  };

  const showAlert = (message, severity = 'success') => {
    setAlert({ show: true, message, severity });
    setTimeout(() => setAlert({ show: false, message: '', severity: 'success' }), 3000);
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      await createBackup();
      showAlert('Backup created successfully');
      fetchBackups();
    } catch (error) {
      showAlert(error.response?.data?.message || 'Error creating backup', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreClick = (backup) => {
    setSelectedBackup(backup);
    setOpenRestoreDialog(true);
  };

  const handleRestoreConfirm = async () => {
    setLoading(true);
    try {
      await restoreBackup(selectedBackup.filename);
      showAlert('Backup restored successfully');
      setOpenRestoreDialog(false);
    } catch (error) {
      showAlert(error.response?.data?.message || 'Error restoring backup', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <Box>
      <Typography variant="h4" className="mb-6 font-bold text-gray-800">
        Database Backup & Restore
      </Typography>

      {alert.show && (
        <Alert severity={alert.severity} className="mb-4">
          {alert.message}
        </Alert>
      )}

      <Card className="shadow-md mb-4">
        <CardContent>
          <Typography variant="h6" className="mb-4 font-semibold">
            Create New Backup
          </Typography>
          <Typography variant="body2" color="textSecondary" className="mb-4">
            Create a backup of your current database. This will include all products, sales,
            users, and configuration data.
          </Typography>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <BackupIcon />}
            onClick={handleCreateBackup}
            disabled={loading}
          >
            {loading ? 'Creating Backup...' : 'Create Backup'}
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardContent>
          <Typography variant="h6" className="mb-4 font-semibold">
            Available Backups
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Filename</TableCell>
                  <TableCell>Date Created</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {backups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography color="textSecondary">
                        No backups available
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  backups.map((backup, index) => (
                    <TableRow key={index}>
                      <TableCell>{backup.filename}</TableCell>
                      <TableCell>{formatDate(backup.created_at)}</TableCell>
                      <TableCell>{formatSize(backup.size)}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleRestoreClick(backup)}
                          title="Restore this backup"
                        >
                          <Restore fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="success"
                          title="Download backup"
                        >
                          <Download fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Alert severity="warning" className="mt-4">
            <strong>Warning:</strong> Restoring a backup will replace all current data with
            the backup data. This action cannot be undone. Please create a backup before
            restoring to avoid data loss.
          </Alert>
        </CardContent>
      </Card>

      <Dialog open={openRestoreDialog} onClose={() => setOpenRestoreDialog(false)}>
        <DialogTitle>Confirm Restore</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to restore the backup "{selectedBackup?.filename}"?
            This will replace all current data with the backup data. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRestoreDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleRestoreConfirm}
            color="warning"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Restoring...' : 'Restore'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Backup;
