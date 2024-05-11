const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


router.post('/', productController.createproduct);
router.get('/', productController.getAllProducts);
router.get('/:productId', productController.getProductById);
router.post('/:productId', productController.updateProductById);
router.delete('/:productId', productController.deleteProductById);
router.get('/bidProducts', productController.getBidProducts);

router.get('/user/:userId', productController.getProductsByuser);

router.put('/closebidding/:productId', productController.closebidding);
module.exports = router;