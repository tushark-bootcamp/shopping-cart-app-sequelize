const http = require('http');
const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

// This tells the express where to look for all the views => 
// the path of which is provided as the first param in the res.render() method in controllers.
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const UserType = require('./models/user-type');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const {
    resolve
} = require('path');
const {
    hasOne
} = require('./models/product');


app.use(bodyParser.urlencoded({
    extended: false
}));

// This gives access to the css file under public folder
app.use(express.static(path.join(__dirname, 'public')));

// Temporary middleware to set the User object in the request to mock authentication until it is properly implemented. 
//** Thing to remember: The middleware is only ever called when the app receives a HTTP request; 
//** NEVER called at the time of server restart */
app.use((req, res, next) => {
    fetchUser('admin')
        .then(user => {
            // The user stored in request is the sequelized object -- NOT just the javascript object with the field values.
            req.user = user;
            // getOrCreateCart() is called asynchronously ==> let the cart fetch/creation happen asynchronously
            getOrCreateCart(user);
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes); // Export syntax (admin.js) => module.exports = router;
//app.use('/admin', adminRoutes.routes); // Export syntax (admin.js) => exports.routes = router;
app.use(shopRoutes);

app.use(errorController.get404);

// Product table has the userId =>
Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);

// User table has the userTypeId =>
User.belongsTo(UserType, {
    constraints: true,
    onDelete: 'CASCADE'
});
UserType.hasMany(User);

//Cart table has UserId
Cart.belongsTo(User);
User.hasOne(Cart);

// CartItem table has CartId and ProductId
Cart.belongsToMany(Product, {
    through: CartItem
});

// //CartItem table has CartId and ProductId
Product.belongsToMany(Cart, {
    through: CartItem
});


const getOrCreateCart = (user) => {
    const promise = new Promise((resolve, reject) => {
        user.getCart()
        .then(cart => {
            if(cart) {
                resolve(cart);
            } else {
                return user.createCart();
            }
        })
        .then(cart => {
            resolve(cart);
        })
        .catch(err => {
            reject(err);
            console.log(err);
        });
    });
    return promise;
}

// Fetches a user and creates one if it doesn't exist with specified uType
// uType is either 'admin' or 'shopper'
const fetchUser = (uType) => {
    const promise = new Promise((resolve, reject) => {
        UserType.findOne({
                where: {
                    userType: uType
                }
            })
            .then(userType => {
                if (!userType) {
                    return UserType.create({
                        userType: uType
                    });
                } else {
                    return userType;
                }
            })
            .then(userType => {
                User.findOne({
                        where: {
                            userTypeId: userType.id
                        }
                    })
                    .then(user => {
                        if (user) {
                            resolve(user);
                        } else {
                            return user = User.create({
                                name: 'User1',
                                email: 'user1@email.com',
                                userTypeId: userType.id
                            });
                            
                        }
                    })
                    .then(user => {
                        resolve(user);
                    })
                    .catch(error => {
                        console.log(error);
                        reject(error);
                    });
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });

    });
    return promise;
}

// sequelize.sync({force:true}) in the sync() method syncs all your models 
// Use {force:true} object whenever you want to synchronise changes to your model with the database.
// Backup your DB before applying {force:true} 
// Update your data upload scripts to re-adjust to new table relations or modifications to your existing schemas and then
// Use {force:true} object in sync() which will restart the server (since we have used nodemon in npm start script).
// Once the database schemas have been updated with your new sequelize model, reload the data carefully with your updated scripts
// Then comment back the sequelize.sync({force:true}) as below
// TODO: Need a validation check at the time of commiting code changes to Git to ensure the line sequelize.sync({force:true}) is always commented 

//sequelize.sync({force:true})
// sequelize.sync() is only called at the time of starting the server (@npm start) 
sequelize.sync()
    .then(result => {
        return fetchUser('admin');
        //Promise.resolve(user);
    })
    .then(user => {
        console.log(user);
        //return user.createCart();
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

// ** Additional Notes on sequelize.sync({force:true})
// Was getting error something along the lines of .... default value error for the id field in Product table.
// It was because of incorrect spelling of autoIncrement key in the Product model. 
// Used {force:true} strategy successfully to resync the sequelize model with my MySQL DB after correcting the spelling.

// The fetchUser2 is an alternate style, the key difference in this implementation is retrieving the user from the 
// usertype object using sequelize association.
const fetchUser2 = (uType) => {
    const promise = new Promise((resolve, reject) => {
        UserType.findOne({
                where: {
                    userType: uType
                }
            })
            .then(userType => {
                if (!userType) {
                    return UserType.create({
                        userType: uType
                    });
                } else {
                    return userType;
                }
            })
            .then(userType => {
                // Check what's the correct method to restrict the results to a single record
                return userType.getUser();
            })
            .then(user => {
                if (user) {
                    resolve(user);
                } else {
                    // Check if we can use resolve here instead of returning
                    return User.create({
                        name: 'User1',
                        email: 'user1@email.com',
                        userTypeId: userType.id
                    });
                }
            })
            .then(user => {
                resolve(user);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
    });
    return promise;
}