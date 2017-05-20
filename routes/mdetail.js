var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/movie_grail.db');

module.exports = function (app) {
    app.get('/mdetail', function (req, res) {
        var movie_id = req.query.id;

        if(isEmptyObject(movie_id)) {
            res.render('home');
        } else {
            var db = new sqlite3.Database('/movie_grail.db',function() {
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
}


function isEmptyObject(obj) {
    if(obj) {
        return !Object.keys(obj).length;
    }
    return true;
}