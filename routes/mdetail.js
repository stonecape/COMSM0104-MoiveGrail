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


                    var select_comment_query = "SELECT movie_comment.comment_id, movie_comment.user_id," +
                        "movie_comment.comment_con, movie_comment.like_num, movie_comment.rank, movie_comment.is_anonymous," +
                        "user_info.username from movie_comment  INNER JOIN user_info ON " +
                        "movie_comment.user_id=user_info.user_id where movie_id = ";
                    select_comment_query = select_comment_query.concat(movie_id).concat(" ORDER BY comment_id desc");
                    console.log("select_comment_query->",select_comment_query);

                    db.all(select_comment_query, function(err, qres) {
                        console.log("qres->",qres);
                        console.log("mdetail_result->",JSON.stringify(mdetail_result));
                        res.render('mdetail', {'movie_data':mdetail_result,
                            'comment_data':qres});
                    });
                } else {
                    console.log("err->",err);
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
        if(req.cookies.username) {
            var isAnonymous = req.body.isAnonymous;
            var movie_id = req.body.movie_id;
            var comment_content = req.body.comment_content;
            var rank = req.body.rank;
            var userid = req.cookies.userid;

            db.run("INSERT INTO movie_comment(user_id, is_anonymous,movie_id,comment_con,rank) VALUES (?,?,?,?,?)",
                userid,isAnonymous,movie_id,comment_content,rank,function(err){
                    if(err){
                        console.log(err);
                        res.send(JSON.stringify({ result: false, detail: "database error" }));
                    }else{
                        res.send(JSON.stringify({ result: true}));
                    }
                });
        } else {
            console.log("No log in! when add comment")
            res.send(JSON.stringify({ result: false, detail: "Please Log In First." }));
        }


    });
}


function isEmptyObject(obj) {
    if(obj) {
        return !Object.keys(obj).length;
    }
    return true;
}