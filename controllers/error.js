exports.get404 = (req, res, next) => {
    // The first param of the res.render() method is the path to the view (.ejs file); 
    // here its path to the 404.ejs in 'views', Hence '404' without the .js
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: ''
    });
}