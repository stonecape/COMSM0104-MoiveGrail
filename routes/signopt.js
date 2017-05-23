var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var db = new sqlite3.Database('movie_g.db');
var crypto = require('crypto');
var dateFormat = require('dateformat');
var now = new Date();

module.exports = function (app) {
    // to page sign up
    app.get('/signuppage', function (req, res) {
        res.render('signup');
    });
    // check whether the username has been registered
    app.post('/signup/checkusername',urlencodedParser, function (req, res) {
        console.log(req.body);
        var username = req.body.userName;

        db.serialize(function() {
            var stmt = db.prepare("SELECT * FROM user_info WHERE username = '"+username+"'");
            stmt.get(function(err,row){
                if(err) {
                    console.log("err->",err);
                    res.send("false");
                } else {
                    console.log("row->",row);
                    if(row == undefined) {
                        res.send("true");
                    } else {
                        res.send("false");
                    }
                }
            });
            stmt.finalize();
        });

    });
    // submit sign up form
    app.post('/signup/submitsignup',urlencodedParser, function (req, res) {
        console.log(req.body);
        var username = req.body.userName.trim();
        var password = req.body.password.trim();
        var repassword = req.body.rePassword.trim();
        var email = req.body.email.trim();

        if(password != repassword) {
            console.log("password != repassword");
            res.send("false");
        } else {
            var md5 = crypto.createHash('md5');
            var passwordmd5 = md5.update(password).digest('base64');
            console.log("passwordmd5->",passwordmd5);

            db.run("INSERT INTO user_info(username,password,email,create_time,state) VALUES (?,?,?,?,?)",
                username,passwordmd5,email, dateFormat(now, "isoDateTime"),1,function(err){
                    if(err){
                        console.log(err);
                        res.render("register_result",
                            {'result':"Woops!",'detail':"There is some technical problems. Please try again later."});
                    }else{
                        res.render("register_result",
                            {'result':"Welcome to Join in Movie Grail"});
                    }
                });
        }
    });
    // to page log in
    app.get('/login', function (req, res) {
        res.render('login');
    });

    // to cookie username
    app.get('/login/getcookie', function (req, res) {
        console.log("/login/getcookie");
        if (req.cookies.username) {
            console.log(req.cookies);
            res.send(req.cookies.username);
        } else {
            res.send("");
        }
    });
    // submit log in ajax
    app.post('/login/submit',urlencodedParser, function (req, res) {
        console.log(req.body);

        var username = req.body.userName.trim();
        var password = req.body.password.trim();

        if (req.cookies.username && req.cookies.username === username) {
            console.log(req.cookies);
            res.send("true");
            return;
        }

        var md5 = crypto.createHash('md5');
        var passwordmd5 = md5.update(password).digest('base64');
        console.log("passwordmd5->",passwordmd5);

        db.serialize(function() {
            var stmt = db.prepare("SELECT * FROM user_info WHERE username " +
                "= '"+username+"' AND password = '"+passwordmd5+"'");
            stmt.get(function(err,row){
                if(err) {
                    console.log("err->",err);
                    res.send("false");
                } else {
                    console.log("row->",row);
                    if(row == undefined) {
                        res.send("false");
                    } else {
                        res.cookie('username', username, {maxAge: 7200 * 1000});
                        res.send("true");
                    }
                }
            });
            stmt.finalize();
        });

    });
};
