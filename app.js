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
var methodOverride=require("method-override");
var cors = require('cors');


const Admin = require('./models/Admin');
const tempUser=require('./models/tempUser');


// const async = require('async');
// const request = require('request');

var app=express()
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://bootcamp_project:ncgproject37825@cluster2.j1yxp.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser: true});

app.use(express.json())
app.use(flash());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret:"Bootcamp_Project",
    resave:false,
    saveUninitialized:false
}));

app.use(cors());
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
app.post("/login",(req,res)=>{
    User.findOne({username:req.body.username},(err,user)=>{
        if(err) console.log(err);
        else{
            if(user.password==req.body.password){
            tempUser.create({username:req.body.username},(err,tempUser1)=>{
                if(err)
                console.log(err);
                else{ 
                console.log(tempUser1.username);
                res.send(user.username);
                }
            });
            }
            else
            res.send("");
        }
    })
});

// Admin Logout
app.get("/logout",function(req,res){
   tempUser.remove({},(err,tempUserDeleted)=>{
    if(err) console.log(err);
    else{
        console.log(tempUserDeleted);
        res.send("");
    }
   })
});

// Sign up a new admin
app.post("/register",async function(req,res)
{   
    console.log("body",req.body);
    // var newUser=new User({username:req.body.username});
    // User.register(newUser,req.body.password,function(err,users)
    // {
    //     if(err){
    //     console.log(err);
    //     }
    //     else
    //     {
    //         passport.authenticate("local")(req,res,function(){
    //         res.send("Authenticated!")
    //    });
    //     }
    // });
    try
    {
        const userExists=await User.findOne({username:req.body.username});
        if(userExists)
        {
            return res.status(422).json({error:"User Exists"});
        }
        const user=new User(req.body);
        await user.save();
        res.status(201).json({message:"Registratioin Successful"});
    }
    catch(err)
    {
        console.log(err);
    }
});


app.get('/testing1',(req,res)=>{
    console.log('in11')
    console.log(req.user);
    res.send('<h1>Logged in!!!</h1>');
});

//Specific to an Admin
app.get('/allUserReviews', (req, res) => {
    var formIds=req.user.formIds;
    var responses=[]
    for(var i=0; i < formIds.length; i++){
        FeedbackForm.find({formIds: formIds[i]},(err,feedback)=>{
            responses.push(responses,feedback);
        })
    }
    console.log(responses);
    res.send({responses})
});

// Create and store form configuration in db
app.post('/configureForm', async (req,res)=>{
    console.log("cofig1",req.body);
    var admin = req.body.username;
    var {productName, event}= req.body.eventDetailsAr[0];
    var cadence=30;
    var access_code=123;
    var isMandatory=false;
    //var product_id=productName+"_"+event+""+Math.floor(Math.random() * 100).toString();

    var questions = [];
    (req.body.inputElements).forEach(question => {
        //console.log(question);
        questions.push({type: question.type, questionText: question.label})
    });
    
    var config = {
        productName,
        username: admin,
        event,
        questions,
        cadence,
    };

    console.log("config: ", config)
    

    await ConfigureForm.create(config,(err,formReturned)=>{
        if(err)
        console.log(err);
        else{
            res.send(formReturned)
            //product_id=productName+"_"+event+""+Math.floor(Math.random() * 100).toString();
            //console.log(product_id);
            // Admin.findOne({username: admin},(err,admin)=>{
            //     if(err)
            //     console.log(err);
            //     else{
            //         // console.log(admin);
            //         // var form_Ids = admin.formIds;
            //         // if (form_Ids == null) {
            //         //     form_Ids = [formReturned._id]
            //         // }else {
            //         //     form_Ids.push(formReturned._id)
            //         // }
            //         // console.log(form_Ids);

            //         admin.save();

            //         // Admin.updateOne({ _id : admin._id },
            //         //     { $set : { product_id: productIds } },
            //         //     function( err, result ) {
            //         //         if ( err ) throw err;
            //         //     });
            //     }
            // })
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
    var form_id="62d96133caa4e0b1437c85cc"

    var formData = new FeedbackForm({
        userId,
        formId: form_id,
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
    var form_id = "62d96133caa4e0b1437c85cc";

    FeedbackForm.find({formId: form_id},(err,allFeedbacks)=>{
        if(err) console.log(err);
        else{
            var allResponse=[]
            console.log("-----------------------------")
            for(var i=0;i<allFeedbacks.length;i++){
                //console.log(allFeedbacks[i].response)
                allResponse.push(allFeedbacks[i].response);
            }
            console.log(allResponse);
        }
    })
})

app.get("/deriveFormMetrics", (req, res) => {
    var form_id = "salesforce_buy21";
     // To do
     // Derive metrics using isFormSubmitted

})

app.post("/adminForms", (req, res) => {
    var admin=req.body.username;
    var allForms = [];
    ConfigureForm.find({username:admin},(err,formsRes)=>{
        if(err) console.log(err);
        else{
            allForms = formsRes;
            console.log("--------all forms",allForms);
            res.send(allForms);
        }
    });
})

app.get("/tempUser",(req,res)=>{
    tempUser.find({},(err,tempUser)=>{
        if(err) console.log(err);
        else{
            res.send(tempUser[0].username);
        }
    })
})

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("App started", host, port)
 })


