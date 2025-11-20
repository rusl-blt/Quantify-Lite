const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.use(authenticateToken);
router.use(authorizeRole('admin'));

router.post('/create', backupController.createBackup);
router.get('/list', backupController.getBackups);
router.post('/restore', backupController.restoreBackup);

module.exports = router;
