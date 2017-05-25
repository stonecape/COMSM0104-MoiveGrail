var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var db = new sqlite3.Database('movie_g.db');

module.exports = function (app) {
    app.get('/mdetail', function (req, res) {
        var movie_id = req.query.id;

        if (isEmptyObject(movie_id)) {
            res.render('home');
        } else {

            var select_mdetail_query = "SELECT movie_id AS id, introduction AS intro, year, title, director, " +
                "writers,stars from movie_detail where movie_id = ";
            select_mdetail_query = select_mdetail_query.concat(movie_id);
            console.log("select_mdetail_query->", select_mdetail_query);

            db.get(select_mdetail_query, function (err, row) {
                var mdetail_result = {};
                console.log("mdetail-row->", row);
                if (!err && row) {
                    console.log(JSON.stringify(row));
                    mdetail_result['title'] = row.title;
                    mdetail_result['introduction'] = row.intro;
                    mdetail_result['id'] = row.id;
                    mdetail_result['year'] = row.year;
                    mdetail_result['director'] = row.director;
                    mdetail_result['writers'] = row.writers;
                    mdetail_result['stars'] = row.stars;


                    var select_comment_query = "SELECT movie_comment.comment_id, movie_comment.user_id," +
                        "movie_comment.comment_con, movie_comment.like_num, movie_comment.dislike_num, " +
                        "movie_comment.rank, movie_comment.is_anonymous," +
                        "user_info.username from movie_comment  INNER JOIN user_info ON " +
                        "movie_comment.user_id=user_info.user_id where movie_id = ";
                    select_comment_query = select_comment_query.concat(movie_id).concat(" ORDER BY comment_id desc");
                    console.log("select_comment_query->", select_comment_query);

                    db.all(select_comment_query, function (err, qres) {
                        /*console.log("qres->", qres);
                        console.log("mdetail_result->", JSON.stringify(mdetail_result));*/
                        var stmt = db.prepare("SELECT avg(rank) AS avg_rank FROM movie_comment WHERE movie_id = '"+movie_id+"'");
                        stmt.get(function(err,avgrow){
                            console.log("avg(rank)->",avgrow.avg_rank);
                            var round_avgrank = Math.round(avgrow.avg_rank);
                            res.render('mdetail', {
                                'movie_data': mdetail_result,
                                'comment_data': qres,
                                'avgrank':round_avgrank,
                                helpers: {
                                    times: function (v1,v2, block) {
                                        n = v1 - v2;
                                        var accum = '';
                                        for (var i = 0; i < n; ++i)
                                            accum += block.fn(i);
                                        return accum;
                                    },
                                    ifCond: function (v1, v2, options) {
                                        if(v1 === v2) {
                                            return options.fn(this);
                                        }
                                        return options.inverse(this);
                                    }
                                }
                            });
                        });
                        stmt.finalize();

                    });
                } else {
                    console.log("err->", err);
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

    app.post('/mdetail/addcomment', urlencodedParser, function (req, res) {
        console.log(req.body);
        if (req.cookies.username) {
            var isAnonymous = req.body.isAnonymous;
            var movie_id = req.body.movie_id;
            var comment_content = req.body.comment_content;
            var rank = req.body.rank;
            var userid = req.cookies.userid;

            db.run("INSERT INTO movie_comment(user_id, is_anonymous,movie_id,comment_con,rank) VALUES (?,?,?,?,?)",
                userid, isAnonymous, movie_id, comment_content, rank, function (err) {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify({result: false, detail: "database error"}));
                    } else {
                        res.send(JSON.stringify({result: true}));
                    }
                });
        } else {
            console.log("No log in! when add comment")
            res.send(JSON.stringify({result: false, detail: "Please Log In First."}));
        }


    });

    // like a comment
    app.get('/mdetail/likecomment', urlencodedParser, function (req, res) {
        var comment_id = req.query.comment_id;
        console.log("likecomment->comment_id:", comment_id);
        db.run("UPDATE movie_comment SET like_num = like_num + 1 WHERE comment_id = ?",
            comment_id, function (err) {
                if (err) {
                    console.log("database err->",err);
                    res.send(JSON.stringify({result: false, detail: "database error"}));
                } else {
                    res.send(JSON.stringify({result: true}));
                }
            });
    });

    // dislike a comment
    app.get('/mdetail/dislikecomment', urlencodedParser, function (req, res) {
        var comment_id = req.query.comment_id;
        console.log("dislikecomment->comment_id:", comment_id);
        db.run("UPDATE movie_comment SET dislike_num = dislike_num + 1 WHERE comment_id = ?",
            comment_id, function (err) {
                if (err) {
                    console.log(err);
                    res.send(JSON.stringify({result: false, detail: "database error"}));
                } else {
                    res.send(JSON.stringify({result: true}));
                }
            });
    });
}


function isEmptyObject(obj) {
    if (obj) {
        return !Object.keys(obj).length;
    }
    return true;
}