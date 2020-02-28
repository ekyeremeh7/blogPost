//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Welcome to My blog! If you checked out the “About Me.” page then you know my name is Emmanuel Kwabena Kyeremeh.  Looking at the front page,this is a Personal Development/Motivational/ blog.Glad you came by.  I wanted to welcome you and let you know I appreciate you spending time here at the blog very much.  Everyone is so busy and life moves pretty fast,  so I really do appreciate you taking time out of your busy day to check out my blog!.   Thanks."
const aboutContent = "Emmanuel Kwabena Kyeremeh is my name.I am a student of Kwame Nkrumah University of Science and Technology.I major in BSC.Computer Science.I am a web and an app developer.";
const contactContent = "You can contact me by gmail:ekyeremeh7@gmail.com | Instagram as ImmanuelQuabenaCheremeh | Facebook as Emmanuel Kwabena Kyeremeh";

const app = express();

//let posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

//create a new database
mongoose.connect("mongodb://localhost:27017/blogDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// create a database schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    content: {
        type: String,
        min: 1,
        max: 1000
    }
});

//model the new mongoose model or retrieve my blogSchema
const Post = new mongoose.model("Post", postSchema);

// //create a document from the retrieved schema
// const Post1 = new Post({
//     title: "Test",
//     post: "This is the Actual Post"
// })


app.get("/", function(req, res) {
    //let postsContentJSON = JSON.stringify(posts);
    //console.log("POSTS CONTENT JSON " + postsContentJSON);
    Post.find({}, function(err, posts) {
        res.render("home", {
            home: homeStartingContent,
            postsContent: posts
        });

    })

});


app.get("/contact", function(req, res) {
    res.render("contact", {
        contact: contactContent
    });
});

app.get("/about", function(req, res) {
    res.render("about", {
        about: aboutContent
    });
});

app.get("/compose", function(req, res) {
    res.render("compose");
});

app.post("/compose", function(req, res) {

    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
    });
    post.save(function(err) {
        if (!err) {
            //posts.push(post);
            res.redirect("/");

        }
    });

});

app.get("/posts/:postId", function(req, res) {
    //const convertedrequestTitle = _.lowerCase(req.params.postName);

    // posts.forEach(function(post) {
    //     const convertedStoredTitle = _.lowerCase(post.title);
    //     if (convertedStoredTitle === convertedrequestTitle) {
    //         res.render("post", {
    //             title: post.title,
    //             body: post.body
    //         });
    //     } else {
    //         console.log("Not a match !!!");
    //     }
    // });

    const requestedPostId = req.params.postId;
    Post.findOne({ _id: requestedPostId }, function(err, post) {
        res.render("post", {
            title: post.title,
            content: post.content
        })
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});