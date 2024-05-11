const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.put('/bidcart', paymentController.payBidCart);
router.put('/normalcart', paymentController.payNormalCart);
router.put('/bookbid', paymentController.bookBid);
router.put('/makesubscriber', paymentController. makeSubscriber);
router.put('/bidpurchase', paymentController. bidpurchase);
router.post('/creatBidroom', paymentController. creatBidroom);
module.exports = router;