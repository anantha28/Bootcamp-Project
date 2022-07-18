var express=require('express');
var async=require('async');
var request=require('request');
var mongoose=require("mongoose");

// const async = require('async');
// const request = require('request');

var app=express()
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://bootcamp_project:ncgproject37825@cluster2.j1yxp.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser: true});
var Feedback=require("./models/feedback");

app.get('/',(req,res)=>{
    console.log("running");
    res.render("base");
});

app.post('/testing1',(req,res)=>{
    console.log('in11')
    Feedback.create({comments:"testing comment",starRating:"5"},(err,newFeedback)=>{
        if(err)
        console.log(err);
        else{
            res.send('<h1>Added value to DB');
        }
    })
});


var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("App started", host, port)
 })


 