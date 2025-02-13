// payment routes
const router = require('express').Router();
const {
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  migrateOrderPayments,
  migrateOrderIdToOrder,
} = require('../controller/payment.controller');
const authenticateAdmin = require('../middlewares/authenticateAdmin');

router.get('/get', authenticateAdmin, getPayments);
router.get('/getById/:id', getPaymentById);
router.put('/update/:id', authenticateAdmin, updatePayment);
router.delete('/delete/:id', authenticateAdmin, deletePayment);
router.post('/migrateOrderPayments', authenticateAdmin, migrateOrderPayments);
router.post('/migrateOrderIdToOrder', authenticateAdmin, migrateOrderIdToOrder);

module.exports = router;
