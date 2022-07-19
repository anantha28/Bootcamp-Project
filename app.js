var express=require('express');
var async=require('async');
var request=require('request');
var mongoose=require("mongoose");
var passport=require("passport");
var localStrategy=require("passport-local");
var User=require('./models/Admin');
var flash=require("connect-flash");
var bodyParser=require("body-parser");
var ConfigureForm = require('./models/ConfigureForm')
var FeedbackForm = require('./models/FeedbackForm');
const Admin = require('./models/Admin');


// const async = require('async');
// const request = require('request');

var app=express()
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://bootcamp_project:ncgproject37825@cluster2.j1yxp.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser: true});

app.use(flash());
app.use(bodyParser.urlencoded({extended:true}));

app.use(require("express-session")({
    secret:"Bootcamp_Project",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get('/',(req,res)=>{ //for dashboard
    console.log("running");
    res.render("base");
});

app.post("/login",passport.authenticate("local",
{
  successRedirect:"/testing1",
  failureRedirect:"/",
  failureFlash:true
}),function(req, res) {
});

app.get("/logout",function(req,res){
   req.logout();
   res.redirect("/login");
});

app.post("/register",function(req,res)
{   
    console.log(req.body);
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,users)
    {
        if(err){
        console.log(err);
        }
        else
        {
            passport.authenticate("local")(req,res,function(){
            res.send("Authenticated!")
       });
        }
    });
});


app.get('/testing1',(req,res)=>{
    console.log('in11')
    console.log(req.user);
    res.send('<h1>Logged in!!!</h1>');
});

//Specific to an Admin
app.get('/allUserReviews', (req, res) => {
    var prod_id=req.user.product_id;
    var responses=[]
    for(var i=0;i<prod_id.length;i++){
        FeedbackForm.find({product_id:prod_id[i]},(err,feedback)=>{
            responses.push(responses,feedback);
        })
    }
    console.log(responses);
    res.send({responses})
});


var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("App started", host, port)
 })


 