const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


router.post('/', productController.createproduct);
router.get('/', productController.getAllProducts);
router.get('/:productId', productController.getProductById);
router.post('/:productId', productController.updateProductById);
router.delete('/:productId', productController.deleteProductById);

module.exports = router;