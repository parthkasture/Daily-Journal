//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Impact is an online publishing platform where you can read and post your blogs.Here you can discover stories, thinking, and expertise from writers on any topic.Typically, Impact is used for thought leadership content. Additionally, feel free to post your blogs on this site.";
const aboutContent = "We are currently pursuing B.Tech in Computer Science & Engineering from IIT Guwahati. This daily blogging website is one of our web development projects. We hope you like it, peace :).";
const contactContent = "Parth Kasture. Email:xx@gmail.com Shashank Kumar. Email:xx@gmail.com ";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
},(err) => {
  if(err){
    console.log(err);
  }
  else{
    console.log("Database connected");
  }
})

const postSchema = {
  title: String,
  content: String 
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      content: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/about", function(req, res){
  res.render("about", {content : aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {content : contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.get("/posts/:post", function(req, res){
  var requestedId = (req.params.post);

  Post.findOne({_id : requestedId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.post("/compose", function(req, res){
  const post= new Post({
    title : req.body.title,
    content : req.body.postBody
  });
  
  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
