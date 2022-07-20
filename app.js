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

// Login for an admin
app.post("/login",passport.authenticate("local",
{
  successRedirect:"/",
  failureRedirect:"/",
  failureFlash:true
}),function(req, res) {
});

// Admin Logout
app.get("/logout",function(req,res){
   req.logout();
   res.redirect("/login");
});

// Sign up a new admin
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

// Create and store form configuration in db
app.post('/configureForm', async (req,res)=>{
    var admin=req.user.username;
    var productName='salesforce';
    var event='buy';
    var cadence=30;
    var access_code=123;
    var form={event:event,questions:[], cadence:cadence,accessCode:access_code}
    var config={productName:productName,forms:form}
    var product_id="";

    await ConfigureForm.create(config,(err,formReturned)=>{
        if(err)
        console.log(err);
        else{
            product_id=productName+"_"+event+""+Math.floor(Math.random() * 100).toString();
            console.log(product_id);
            Admin.findOne({username:admin},(err,admin)=>{
                if(err)
                console.log(err);
                else{
                    console.log(admin);
                    var productIds = admin.product_id
                    if (productIds == null) {
                        productIds = [product_id]
                    }else {
                        productIds.push(product_id)
                    }
                    console.log(productIds);

                    Admin.updateOne({ _id : admin._id },
                        { $set : { product_id: productIds } },
                        function( err, result ) {
                            if ( err ) throw err;
                        });
                }
            })
        }
    });
});

// Store feedback form data submitted by a user
app.post('/storeUserResponse', (req, res) => {
    var userId = "123";
    var productName = "salesforce";
    var eventName = "buy";
    var response = ["aaaa","bbbb"];
    var dateOfPopup = Date.now();
    var isFormSubmitted = true;
    var product_id="salesforce_buy21"

    var formData = new FeedbackForm({
        userId,
        productId: product_id,
        productName,
        eventName,
        response,
        dateOfPopup,
        isFormSubmitted
    });

    formData.save()

});

//List all responses specific to a product & event
app.get("/listAllResponses",(req,res)=>{
    var product_id="salesforce_buy21";

    FeedbackForm.find({productId:product_id},(err,allFeedbacks)=>{
        if(err) console.log(err);
        else{
            var allResponse=[]
            console.log("-----------------------------")
            for(var i=0;i<allFeedbacks.length;i++){
                console.log(allFeedbacks[i].response)
                allResponse.push(allFeedbacks[i].response);
            }
            console.log(allResponse);
        }
    })
})

app.get("/deriveFormMetrics", (req, res) => {
    var product_id = "salesforce_buy21";
     // To do
     // Derive metrics using isFormSubmitted

})


var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("App started", host, port)
 })


