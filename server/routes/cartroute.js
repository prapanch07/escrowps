const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', cartController.fetch_cart);
router.post('/purchases', cartController.create_pur_cart);
router.get('/fetchPurCart/:userId', cartController.fetchPurCart);


module.exports = router;