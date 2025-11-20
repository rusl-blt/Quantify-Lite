const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', userController.getAllUsers);
router.post('/', authorizeRole('admin', 'manager'), userController.createUser);
router.put('/:id', authorizeRole('admin', 'manager'), userController.updateUser);
router.delete('/:id', authorizeRole('admin'), userController.deleteUser);

module.exports = router;
