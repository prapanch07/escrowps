const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/fetchProducts', adminController.fetchProducts);
router.delete('/del_product/:productId', adminController.delProduct);



router.get('/fetchUsers', adminController.fetchusers);
router.delete('/del_user/:user_id', adminController.deleteUser);


router.get('/currentbidDay', adminController.currentbidDay);
router.post('/changeDay', adminController.changeDay);
router.post('/changestarttime', adminController.changestarttime);
router.post('/changeclosetime', adminController.changeclosetime);



router.delete('/delAll', adminController.delAll);




module.exports=router;