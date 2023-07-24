//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
        bcrypt.hash(req.body.password, saltRounds, function(err, hash){
            const newUser = new User ({
                email: req.body.username,
                password: hash
            });
            newUser.save().then(function(){
                res.render("secrets");
            }).catch(function(err){
                console.log(err);
            });
        });
    });

app.route("/login").post(function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}).then((foundUser)=>{
        if(foundUser){
            bcrypt.compare(password, foundUser.password).then(function(result){
                if(result === true){
                    console.log("Login successful");
                    res.render("secrets");
                }
            });
        }
    });
});



app.listen(port, function(){
    console.log("Server started on port " + port);
});
