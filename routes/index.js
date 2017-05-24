var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var db = new sqlite3.Database('movie_g.db');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('home');
    });

    app.get('/search', urlencodedParser, function (req, res) {
        var search_text = req.query.search_text.trim();
        var stmt = db.prepare("SELECT movie_id FROM movie_detail WHERE title LIKE '%"+search_text+"%'");
        stmt.get(function(err,row){
           if(err) {
                console.log("database err->",err);
                res.send(JSON.stringify({result: false, detail: "database error"}));
            } else {
               console.log("search movie_id->",row);
                if(row) {
                    res.send(JSON.stringify({result: true, detail: row.movie_id}));
                } else {
                    res.send(JSON.stringify({result: true, detail: ""}));
                }

            }
        });
        stmt.finalize();
    });

};