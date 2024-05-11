const express = require('express');
const router = express.Router();
const bidsController = require('../controllers/bidsController');

router.post('/', bidsController.createBid);
router.post('/fetch', bidsController.fetchBids);

router.get('/getLivebids', bidsController.getLivebid);
router.get('/findBidroom', bidsController.findBidroom);

router.get('/bidBybidroom/:bidroomId', bidsController.fetchBids_roomId);
router.get('/BidDays', bidsController.BidDays);
router.get('/:productId', bidsController.fetchBids_products);

router.get('/getbidrooms/:userId', bidsController.fetchBidrooms_user);



router.put('/:bidId/accept', bidsController.acceptBid);
router.put('/:productId', bidsController.createBidRoom);


module.exports = router;