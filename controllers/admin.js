const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    console.log('This is my add products middleware!');
    // The first param of the res.render() method is the path to the view (.ejs file); 
    // here its path to the edit-product.ejs (formerly add-product.ejs) under the admin folder.
    // Hence 'admin/edit-product' without the .js
    res.render('admin/edit-product', {
        editing: false,
        pageTitle: 'Add Product',
        // path is only used to highlight the menu on navigation & not to be confused with router.
        path: '/admin/add-product'
    });
}

exports.postAddProduct = (req, res, next) => {
    console.log(req.body);
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    //** Magic Association methods: Observe how we have made use of the sequelize User object that we stored in */
    // request obj from the app.js. Its relation with the Product object allowed us to call the createProduct method 
    // on the User object instead of the Product object 
    req.user.createProduct({
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description
        })
        .then(result => {
            //console.log(result);
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err)
        });
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    // productId should be exactly as defined in your route => :productId
    const prodId = req.params.productId;
    console.log('This is my edit products middleware!');
    Product.findByPk(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            console.log(product);
            res.render('admin/edit-product', {
                editing: editMode,
                product: product,
                // path is non-existent in navigation bar as we don't want to highlight any path on the navigation bar for edit product.
                pageTitle: 'Edit Product',
                path: '/admin/edit-product'
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postEditProduct = (req, res, next) => {
    console.log(req.body);
    const prodId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product.findByPk(prodId)
        .then(product => {
            product.title = title;
            product.imageUrl = imageUrl;
            product.price = price;
            product.description = description;
            //** BADD code would be */ 
            // product.save().then(...).catch(err => console.log(err));
            // instead, return and use .then
            return product.save();
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err =>
            console.log(err)
        );
}

exports.postDeleteProduct = (req, res, next) => {
    console.log(req.body);
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            //** BADD code would be */ 
            // product.save().then(...).catch(err => console.log(err));
            // instead, return and use .then
            return product.destroy();
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err =>
            console.log(err)
        );
}


exports.getProducts = (req, res, next) => {
    //console.log(products);
    Product.findAll()
        .then(products => {
            console.log(products);
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
}