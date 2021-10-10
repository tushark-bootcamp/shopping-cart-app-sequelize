const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            console.log(products);
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getProduct = (req, res, next) => {
    // The 'productId' in req.params.productId should match the param name used in your route i.e. routes/shop.js
    // router.get('/products/:productId', shopController.getProduct);
    const prodId = req.params.productId;
    console.log(prodId);
    //console.log(products); 
    Product.findByPk(prodId)
        .then((product) => {
            console.log(product);
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err)
        });

    //** Alternate syntax */ 
    // Product.findAll({
    //         where: {
    //             id: prodId
    //         }
    //     })
    //     .then(products => {
    //         console.log(products);
    //         res.render('shop/product-detail', {
    //             product: products[0],
    //             pageTitle: products[0].title,
    //             path: '/products'
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });

}

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            console.log(products);
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            console.log('Cart objects ===>');
            console.log(cart);
            return cart.getProducts();
        })
        .then(products => {
            if (!products) {
                products = [];
            }
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                cartProds: products
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postCart = (req, res, next) => {
    const prodGId = req.body.productId;
    console.log(prodGId);
    let fetchedCart;
    let newQty = 1;
    // Cart is fetched/created in the app.js middleware
    req.user.getCart()
        .then(cart => {
            //const products =
            fetchedCart = cart;
            return cart.getProducts({
                where: {
                    id: prodGId
                }
            });
        })
        .then(products => {
            // Sequelize sends empty array never a null if no records are found 
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQty = product.cartItem.quantity;
                newQty = oldQty + 1;
                return product;
            } else {
                return Product.findByPk(prodGId);
            }
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: {
                    quantity: newQty
                }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postCartDeleteItem = (req, res, next) => {
    console.log(req.body);
    const prodGId = req.body.productId;
    let fetchedCart;
    let oldQty;
    req.user.getCart()
        .then(cart => {
            //const products =
            fetchedCart = cart;
            return cart.getProducts({
                where: {
                    id: prodGId
                }
            });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err)
        });
}

exports.postOrder = (req, res, next) => {
    let cartProducts;
    let fetchedCart;
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
    })
    .then(products => {
        cartProducts = products;
        console.log(products);
        return req.user.createOrder();
    })
    .then(order => {
        return order.addProducts(cartProducts.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
        }));
    })
    .then((result) => {
        fetchedCart.setProducts(null);
    })
    .then(() => {
        res.redirect('/orders')
    })
    .catch(err => {console.log(err)});
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders({include: ['products']})
    .then(orders => {
        res.render('shop/orders', {
            pageTitle: 'Your Orders',
            orders: orders,
            path: '/orders'
        });
    })
    .catch(err => {console.log(err)});
    
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        prods: products,
        pageTitle: 'Checkout',
        path: '/checkout'
    });
}

