//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
    }
);

app.get("/login", function(req, res){
    res.render("login");
    }
);

app.route("/register")
    .get(function(req, res){
        res.render("register");
    })
    .post(function(req, res){
        const newUser = new User ({
            email: req.body.username,
            password: md5(req.body.password)
        });
        newUser.save().then(function(){
            res.render("secrets");
        }).catch(function(err){
            console.log(err);
        });
    })

app.route("/login").post(function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password);
    User.findOne({email: username}).then((foundUser)=>{
        if(foundUser){
            if(foundUser.password === password){
                console.log("Login successful");
                res.render("secrets");
            }
        }
    });
});



app.listen(port, function(){
    console.log("Server started on port " + port);
});
