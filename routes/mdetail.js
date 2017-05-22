var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var db = new sqlite3.Database('movie_g.db');

module.exports = function (app) {
    app.get('/mdetail', function (req, res) {
        var movie_id = req.query.id;

        if(isEmptyObject(movie_id)) {
            res.render('home');
        } else {

            var select_mdetail_query = "SELECT movie_id AS id, introduction AS intro, year, title, director, " +
                "writers,stars from movie_detail where movie_id = ";
            select_mdetail_query = select_mdetail_query.concat(movie_id);
            console.log("select_mdetail_query->",select_mdetail_query);

            db.each(select_mdetail_query, function(err, row) {
                var mdetail_result = {};
                if(!err) {
                    console.log(JSON.stringify(row));
                    mdetail_result['title'] = row.title;
                    mdetail_result['introduction'] = row.intro;
                    mdetail_result['id'] = row.id;
                    mdetail_result['year'] = row.year;
                    mdetail_result['director'] = row.director;
                    mdetail_result['writers'] = row.writers;
                    mdetail_result['stars'] = row.stars;


                    var select_comment_query = "SELECT * from movie_comment where movie_id = ";
                    select_comment_query = select_comment_query.concat(movie_id);
                    console.log("select_comment_query->",select_comment_query);

                    db.all(select_comment_query, function(err, qres) {
                        console.log("qres->",qres);
                        console.log("mdetail_result->",JSON.stringify(mdetail_result));
                        res.render('mdetail', {'movie_data':mdetail_result,
                            'comment_data':qres});
                    });
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


        }
    });

    app.post('/mdetail/addcomment',urlencodedParser, function (req, res) {
        console.log(req.body);
        var isAnonymous = req.body.isAnonymous;
        var movie_id = req.body.movie_id;
        var comment_content = req.body.comment_content;

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