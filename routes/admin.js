const express = require('express');

const adminController = require('../controllers/admin'); 

const router = express.Router();


// /admin/add-product => with GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => with GET
router.get('/products', adminController.getProducts);


// /admin/add-product => with POST
router.post('/add-product', adminController.postAddProduct);

router.post('/edit-product', adminController.postEditProduct);

// /admin/edit-product => with GET
router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;

//import syntax => 
// 1. const adminRoutes = require('./routes/admin');
// 2. app.use('/admin', adminRoutes);

// Another syntax to export router. This syntax is used when more than 1 conts have to be exported
// exports.routes = router; 
// import syntax =>
// 1. const adminRoutes = require('./routes/admin');
// 2. app.use('/admin', adminRoutes.routes);

// Yet another syntax to export
// module.exports.routesHandler = router;
