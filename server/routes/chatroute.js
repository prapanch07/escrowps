const express = require('express');
const router = express.Router();
const chatController = require('../controllers/ChatController');

router.post('/', chatController.createMessage);
router.get('/', chatController.fetchMessages );
router.get('/conversation', chatController.fetchConversation );

module.exports = router;