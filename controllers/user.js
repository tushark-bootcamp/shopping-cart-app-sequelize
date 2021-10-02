const Product = require('../models/product');

exports.getCart = (req, res, next) => {
    //console.log(products);
    Product.getProduct((productId) => {
        res.render('shop/product-list', {
            prod: product,
            pageTitle: 'Product Detail',
            path: '/product'
        });
    });
}