var marked = require ('marked');
var fs = require('fs');

module.exports = function (app) {
    app.get('/about', function (req, res) {
        var path = "./ABOUT.md";
        var include = fs.readFileSync (path, 'utf8');
        var html = marked (include);
        res.render("about",{about_markdown_file:html});

    });

};
