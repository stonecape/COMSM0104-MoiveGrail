var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = function (app) {
    app.get('/mdetail', function (req, res) {
        var movie_id = req.query.id;

        if(isEmptyObject(movie_id)) {
            res.render('home');
        } else {
            var db = new sqlite3.Database('/movie_g.db',function() {
                var select_query = "select movie_id AS id, introduction AS intro, year, title, director, " +
                    "writers,stars from movie_detail where movie_id = ";
                select_query = select_query.concat(movie_id);
                console.log(select_query);

                db.each(select_query, function(err, row) {
                    console.log(JSON.stringify(row));
                    if(!err) {
                        res.render('mdetail', { 'title': row.title,'introduction' : row.intro,
                        'id':row.id, 'year':row.year, 'director': row.director, 'writers':row.writers,
                        'stars':row.stars});
                    } else {
                        res.render('home');
                    }
                });
               /*db.all(select_query,function(err,qres){
                    if(!err) {
                        var moviedata = JSON.stringify(qres);
                        console.log(moviedata);
                        console.log(moviedata[1].title);
                        res.render('mdetail', { 'moviedata' : moviedata });
                    } else {
                        console.log(JSON.stringify(qres));
                        res.render('home');

                    }
                });*/
            });
        }
    });

    app.post('/mdetail/addcomment',urlencodedParser, function (req, res) {
        console.log(req.body);
        var isAnonymous = req.body.isAnonymous;
        var movie_id = req.body.movie_id;
        var comment_content = req.body.comment_content;

        var db = new sqlite3.Database('/movie_g.db');
        db.run("INSERT INTO movie_comment(is_anonymous,movie_id,comment_con) VALUES (?,?,?)",
            isAnonymous,movie_id,comment_content,function(err){
            if(err){
                console.log(err);
                res.send("false");
            }else{
                res.send("true");
            }
        });

    });
}


function isEmptyObject(obj) {
    if(obj) {
        return !Object.keys(obj).length;
    }
    return true;
}