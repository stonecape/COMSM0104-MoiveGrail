var sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var db = new sqlite3.Database('movie_g.db');
var crypto = require('crypto');
var dateFormat = require('dateformat');
var now = new Date();
var salt = "t{Z@WLoJ"; // encrypt the password: md5(originalpassword+salt)
/*var algorithm = 'aes-256-ctr',
    pas = '@p4gt)Ox';// encrypt the cookie*/


module.exports = function (app) {
    // to page sign up
    app.get('/signuppage', function (req, res) {
        res.render('signup');
    });
    // check whether the username has been registered
    app.post('/signup/checkusername',urlencodedParser, function (req, res) {
        console.log(req.body);
        var username = req.body.userName;
        checkUserNameCanBeRegistered(username, function(qes) {
            console.log("qes-",qes);
            if(qes) {
                res.send("true");
            } else {
                res.send("false");
            }
        });

    });
    // submit sign up form
    app.post('/signup/submitsignup',urlencodedParser, function (req, res) {
        console.log(req.body);
        var username = req.body.userName.trim();
        var password = req.body.password.trim();
        var repassword = req.body.rePassword.trim();
        var email = req.body.email.trim();

        if(password !== repassword || password.length < 6 ||  password.length > 12) {
            console.log("password != repassword");
            res.render("register_result",
                {'result':"Woops!",'detail':"Please type your password correctly. Please try again later."});

        }
        checkUserNameCanBeRegistered(username, function(qes) {
            console.log("qes-",qes);
            if(res) {
                var md5 = crypto.createHash('md5');
                var passwordmd5 = md5.update(password+salt).digest('base64');
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
            } else {
                console.log("username has been registered");
                res.render("register_result",
                    {'result':"Woops!",'detail':"The username has been registered. Please try again later."});
            }
        });
    });
    // to page log in
    app.get('/login', function (req, res) {
        res.render('login');
    });

    // to cookie username
    app.get('/login/getcookie', function (req, res) {
        console.log("/login/getcookie");
        if (req.session.username) {
            //console.log(req.cookies);
            res.send(req.session.username);
        } else {
            res.send("");
        }
    });

    // to checkIsLogin
    app.get('/login/checkIsLogin', function (req, res) {
        console.log("/login/checkIsLogin");
        if (req.session.username) {
            //console.log(req.cookies);
            res.send("true");
        } else {
            res.send("false");
        }
    });
    // logout
    app.get('/logout',urlencodedParser, function (req, res) {
        /*if(req.session.username) {
            res.clearCookie("username");
        }
        if(req.cookies.userid) {
            res.clearCookie("userid");
        }*/
        req.session.destroy(function(err){
            if(err){
                console.log(err);
            }
            else
            {
                res.send("true");
            }
        });

    });
    // submit log in ajax
    app.post('/login/submit',urlencodedParser, function (req, res) {
        console.log(req.body);

        var username = req.body.userName.trim();
        var password = req.body.password.trim();

        if (req.session.username && req.session.username === username) {
            //console.log(req.cookies);
            res.send("true");
            return;
        }

        var md5 = crypto.createHash('md5');
        var passwordmd5 = md5.update(password+salt).digest('base64');
        console.log("passwordmd5->",passwordmd5);

        db.serialize(function() {
            var stmt = db.prepare("SELECT * FROM user_info WHERE username = $username AND password = $passwordmd5");
            /*var stmt = db.prepare("SELECT * FROM user_info WHERE username " +
                "= '"+username+"' AND password = '"+passwordmd5+"'");*/
            stmt.get({$username:username, $passwordmd5:passwordmd5},function(err,row){
                if(err) {
                    console.log("err->",err);
                    res.send("false");
                } else {
                    console.log("row->",row);
                    if(row === undefined) {
                        res.send("false");
                    } else {
                        sess=req.session;
                        sess.username = username;
                        sess.userid = row.user_id;
                        /*res.cookie('username', username, {maxAge: 7200 * 1000});
                        res.cookie('userid', row.user_id, {maxAge: 7200 * 1000});*/
                        res.send("true");
                    }
                }
            });
            stmt.finalize();
        });

    });
};

// true: the username can be registered
function checkUserNameCanBeRegistered(userName, callback) {
    console.log("enter checkUserNameCanBeRegistered");
    db.serialize(function() {
        var stmt = db.prepare("SELECT * FROM user_info WHERE username = $username");
        stmt.get({$username:userName},function(err,row){
            if(err) {
                console.log("database error->",err);
                callback(false);
            } else {
                //console.log("row->",row);
                if(row === undefined) {
                    callback(true);
                } else {
                    callback(false);
                }
            }
        });
        stmt.finalize();
    });
}

