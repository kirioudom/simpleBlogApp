var express = require("express"),
    mongoose = require("mongoose"),
    paths = require("path"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override")
app = express();

mongoose.connect("mongodb://localhost/blog_db");
var publicPath = paths.resolve(__dirname, "public");
app.use(express.static(publicPath));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    create: { type: Date, default: Date.now }
});

var blog = mongoose.model("blog", blogSchema);

app.get("/", function(req, res) {
    res.redirect("/index");
});

app.get("/index", function(req, res) {

    blog.find({}, function(err, success) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { data: success });
        }

    });
});

app.post("/index", function(req, res) {
    blog.create(req.body.data, function(err, success) {
        if (err) {
            console.log(err);
        } else {
            console.log("suceesfully posted")
            res.redirect("index");
        }
    });
});

app.get("/index/create", function(req, res) {
    res.render("create");

});

app.get("/index/show/:id", function(req, res) {
    blog.findById(req.params.id, function(err, success) {
        if (err) {
            res.send("something went wrong!!");
        } else {
            res.render("show", { data: success });
        }
    });
});

app.get("/index/:id/edit", function(req, res) {
    blog.findById(req.params.id, function(err, success) {
        if (err) {
            console.log("something went wrong");
        } else {
            res.render("edit", { data: success });
        }
    });
});

app.put("/index/:id", function(req, res) {
    blog.findByIdAndUpdate(req.params.id, req.body.data, function(err, success) {
        if (err) {
            console.log("something went wrong");
        } else {
            res.redirect("/index/show/" + req.params.id);
        }

    });
});

app.delete("/index/:id", function(req, res) {
    blog.findByIdAndRemove(req.params.id, function(err, success) {
        if (err) {
            console.log("something went wrong");
        } else {
            res.redirect("/index");
        }
    })
});


app.listen(8080, function() {
    console.log("server has started");
})