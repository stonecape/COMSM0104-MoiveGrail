//input express
var express = require('express');
var cookieParser = require('cookie-parser');

var hbs = require('express-handlebars').create({
    defaultLayout: 'main',
    extname: '.hbs'
});
var app = express();

app.set('port',process.env.PORT || 3000);
app.engine('hbs',hbs.engine);
app.set('view engine','hbs');
app.use(cookieParser());

//public is a static folder
app.use(express.static(__dirname + '/public'));
var routes_index = require('./routes/index.js')(app);
var routes_mdetail = require('./routes/mdetail.js')(app);
var routes_signopt = require('./routes/signopt.js')(app);

app.listen(app.get('port'), function () {
    console.log( 'The server is running, port: '+app.get('port') );
});

