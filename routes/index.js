var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var db = new sqlite3.Database('movie_g.db');

module.exports = function (app) {
    app.get('/', function (req, res) {
        var sort_opt = req.query.sort_opt;
        console.log("sort_opt->",sort_opt);
        generateQuerySQL(sort_opt, function(select_query) {
            console.log(select_query);
            db.serialize(function() {
                console.log("select_query->",select_query);
                var stmt = db.prepare(select_query);
                stmt.all(function(err,rows){
                    if(err) {
                        console.log("err->",err);
                        res.render('home');
                    } else {
                        console.log("rows->",rows);
                        res.render('home',{"recommend":rows,
                            "sort_opt":sort_opt,
                            helpers:{
                                select: function (value, options) {
                                    return options.fn(this).replace(
                                        new RegExp(' value=\"' + value + '\"'),
                                        '$& selected="selected"');
                                }
                            }});
                    }
                });
                stmt.finalize();
            });
        });


    });

    app.get('/search', urlencodedParser, function (req, res) {

        var search_text = req.query.search_text.trim();
        var stmt = db.prepare("SELECT movie_id FROM movie_detail WHERE title LIKE $search_text");
        stmt.get({$search_text:"%"+search_text+"%"},function(err,row){
           if(err) {
                console.log("database err->",err);
                res.send(JSON.stringify({result: false, detail: "database error"}));
            } else {
               console.log("search movie_id->",row);
                if(row) {
                    res.send(JSON.stringify({result: true, detail: row.movie_id}));
                } else {
                    res.send(JSON.stringify({result: true}));
                }

            }
        });
        stmt.finalize();
    });

};

function generateQuerySQL(sort_opt, callback) {
    if(!sort_opt) {
        callback("SELECT movie_id, title, introduction, year " +
            "FROM movie_detail ORDER BY year DESC LIMIT 3");
    }else if(sort_opt.trim() === "0") {
        // newest
        callback("SELECT movie_id, title, introduction, year " +
            "FROM movie_detail ORDER BY year DESC LIMIT 3");
    } else if(sort_opt.trim() === "1") {
        // top rated
        callback("SELECT m.movie_id,m.title,m.introduction,m.year,AVG(c.rank)" +
            " AS Rank FROM movie_detail AS m LEFT JOIN movie_comment AS c " +
            "ON m.movie_id = c.movie_id GROUP BY m.movie_id ORDER BY Rank DESC LIMIT 3");
    } else if(sort_opt.trim() === "2") {
        // most commented
        callback("SELECT m.movie_id,m.title,m.introduction,m.year,COUNT(c.movie_id) " +
            "AS Count FROM movie_detail AS m LEFT JOIN movie_comment AS c " +
            "ON m.movie_id = c.movie_id GROUP BY m.movie_id ORDER BY Count DESC LIMIT 3");
    }
}