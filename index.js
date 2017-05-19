//input express
var express = require('express');

var hbs = require('express-handlebars').create({
    defaultLayout: 'main',
    extname: '.hbs'
});
var app = express();

app.set('port',process.env.PORT || 3000);
app.engine('hbs',hbs.engine);
app.set('view engine','hbs');

//public is a static folder
app.use(express.static(__dirname + '/public'));

// home page router
app.get('/', function (req, res) {
    res.render('home',{
        title:'Home Page'
    });
});


app.listen(app.get('port'), function () {
    console.log( 'The server is running, port: '+app.get('port') );
});