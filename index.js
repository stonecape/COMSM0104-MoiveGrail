//input express
var express = require('express');
var cookieParser = require('cookie-parser');
var validUrl = require('valid-url');
var url = require('url');
var session		=	require('express-session');

var hbs = require('express-handlebars').create({
    defaultLayout: 'main',
    extname: '.hbs'
});
var app = express();

app.set('port', process.env.PORT || 3000);
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(cookieParser());

//public is a static folder
app.use(express.static(__dirname + '/public'));
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(function (req, res, next) {
    getFullUrl(req, function (fullUrl) {
        console.log("fullURL->", fullUrl);
        if (validUrl.isUri(fullUrl)) {
            next();
        }
        else {
            console.log('Not a URI->',fullUrl);
            res.render('error', {"message": "Don't be naughty. This is not a validated URL."});
        }

    });

});

var routes_index = require('./routes/index.js')(app);
var routes_mdetail = require('./routes/mdetail.js')(app);
var routes_signopt = require('./routes/signopt.js')(app);
var routes_about = require('./routes/about.js')(app);


// handle 404
app.use(function (req, res) {
    res.render('error', {"message": "Sorry, the page is lost."});
});

// Handle 500
app.use(function (error, req, res, next) {
    console.error("Internal Server Error->", error);
    res.status(500);
    res.render('error', {"message": "500: Internal Server Error."});
});

app.listen(app.get('port'), function () {
    console.log('The server is running, port: ' + app.get('port'));
});


function getFullUrl(req, callback) {
    callback(url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
    }));
}
