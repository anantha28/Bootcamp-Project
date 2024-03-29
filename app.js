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
const e = require('connect-flash');


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
    console.log("request body login: ", req.body)
    User.findOne({username:req.body.username},(err,user)=>{
        if(err){
            console.log("=======DB error=======");
            res.status(401).send({
                message: 'Database error'
             });
        } 
        else{
            console.log("User from db:",user);
            if (user!=null) {
                if(user.password==req.body.password){
                    console.log('inside if block');
                    tempUser.remove({},(err,tempUserDeleted)=>{
                        if(err) console.log(err);
                        else{
                            console.log(tempUserDeleted);
                            tempUser.create({username:req.body.username},(err,tempUser1)=>{
                                if(err)
                                console.log(err);
                                else{ 
                                console.log('inside temp user');
                                console.log(tempUser1.username);
                                res.send(user.username);
                            }
                        });
                        }
                       })
                    
                }
                else{
                    console.log("password incorrect");
                    res.status(401).send({
                        message: 'password incorrect'
                     });
                }
            }
            else {
                console.log("User does not exist");
                res.status(400).send({ error: "User does not exist"});
            }
            
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
        res.status(201).json({message:"Registration Successful"});
    }
    catch(err)
    {
        console.log(err);
    }
});


app.get('/testing1',(req,res)=>{
    console.log('in11')
    console.log(req.user);
    res.render("testing1.ejs");
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
    var admin;

    tempUser.find({},(err,tempUser)=>{
        if(err) console.log(err);
        else{
            admin = tempUser[0].username;
            console.log("cofig1",req.body);
    
    var {productName, event}= req.body.eventDetailsAr[0];
    var cadence=req.body.cadence;
    var access_code=123;
    var isMandatory=false;
    //var product_id=productName+"_"+event+""+Math.floor(Math.random() * 100).toString();

    var questions = [];
    if (req.body.inputElements) {
        (req.body.inputElements).forEach(question => {
            //console.log(question);
            questions.push({type: question.type, questionText: question.label})
        });
    }
    
    
    var config = {
        productName,
        username: admin,
        event,
        questions,
        cadence,
    };

    console.log("config: ", config)
    

    ConfigureForm.create(config,(err,formReturned)=>{
        if(err)
        console.log(err);
        else{
            console.log('---------Form returned',formReturned);
            res.status(200).json({message:"Form Configured", id: formReturned._id});
           // res.send(formReturned._id);
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
        }
    })
});

// Store feedback form data submitted by a user
app.post('/storeUserResponse', (req, res) => {
    var userId = req.body.username;
    var productName = req.body.productName;
    var eventName = req.body.productName;
    var response = [];
    const d = new Date();
    var dateOfPopup = d.getTime();
    var isFormSubmitted = true;
    var form_id=req.body.formId;
    var url=req.body.url; 

    var response_arr=Object.values(req.body);
    response = response_arr.slice(4);

    var formData = new FeedbackForm({
        userId,
        formId: form_id,
        productName,
        eventName,
        response,
        dateOfPopup,
        isFormSubmitted
    });
    formData.save();
    console.log(url);
    res.redirect(url);
    
});

//List all responses specific to a product & event
app.get("/listAllResponses/:formId",(req,res)=>{
    var formId = req.params.formId;

    FeedbackForm.find({formId: formId},(err,allFeedbacks)=>{
        if(err) console.log(err);
        else{
            var allResponse=[]
            console.log("-------------User Responses----------------")
            for(var i=0;i<allFeedbacks.length;i++){
                //console.log(allFeedbacks[i].response)
                allResponse.push(allFeedbacks[i].response);
            }
            console.log(allResponse);
            res.send(allResponse);
            
        }
    })
})

app.get("/deriveFormMetrics", (req, res) => {
    var form_id = "salesforce_buy21";
     // To do
     // Derive metrics using isFormSubmitted

})

app.post("/adminForms", (req, res) => {
    var admin;

    tempUser.find({},(err,tempUser)=>{
        if(err) console.log(err);
        else{
            admin = tempUser[0].username;
           // console.log("Inside tempUser",admin);
            var allForms = [];
            ConfigureForm.find({username:admin},(err,formsRes)=>{
            if(err) console.log(err);
            else{
                allForms = formsRes;
                //console.log("--------all forms",allForms);
                res.send(allForms);
            }
    });
        }
    });
});

// app.get("/getForm/:username",(req,res)=>{
    // tempUser.find({},(err,tempUser)=>{
    //     if(err) console.log(err);
    //     else{
    //         admin = tempUser[0].username;
    //     }
    // });
// })

app.post("/getForm", (req, res) => {
    //var username;
    
   var formId = req.body.id.id;
   // var formId = 
   console.log(formId)

    ConfigureForm.findOne({_id: formId}, (err, form) => {
        if (err) console.log(err)
        else {
            console.log(form)
            res.send(form)
        }
    })
})

app.get("/tempUser",(req,res)=>{
    tempUser.find({},(err,tempUser)=>{
        if(err) console.log(err);
        else{
            res.send(tempUser[0].username);
        }
    })
})

app.post("/storeUserResponse11",(req,res)=>{
    console.log(req.body);
    res.send(req.body);
})


app.get("/getallform/:username/:formId",(req,res)=>{
    var formId = mongoose.Types.ObjectId(req.params.formId.trim());
    var username=req.params.username;
    console.log(formId,username);
    console.log(typeof(formId));
    ConfigureForm.findById(formId,(err,formValues)=>{
        if(err)
        console.log(err);
        else{
            //console.log(formValues);
            res.render("form.ejs",{formValues:formValues,username:username});
        }
    })
});

app.post("/getUserForm/:formId",(req,res)=>{
    var formId=req.params.formId;
    var username=req.body.username;
    var prev_url = req.body.url;
    console.log("before");
    ConfigureForm.findById(formId,(err,formReturned)=>{
        if(err) console.log(err);
        else{
            formReturned.url=prev_url;
            formReturned.save();
        }
    })
    console.log("after");

    res.send("http://localhost:8080/getallform/"+username+"/"+formId);
})

app.post("/getUserForm/:formId/time",(req,res)=>{
    var formId=req.params.formId;
    var username=req.body.username;
    console.log(formId,username);
    console.log(typeof(formId),typeof(username));
    var prev_url = req.body.url;
    console.log("before");
    FeedbackForm.findOne({formId:formId,userId:username},(err,formReturned)=>{
        if(err) console.log(err);
        else{
            console.log(formReturned);
            if(formReturned == null){
                console.log("no form found");
                res.send("pass");
            }
            else{
            console.log('inside feedback form');
            const d = new Date();
            console.log(d.getTime());
            var curTime=d.getTime();
            console.log("====formReturend time===",formReturned.dateOfPopup);
            ConfigureForm.findById(formId,(err,configForm)=>{
                if(err)
                console.log(err);
                else{
                    console.log('inside config form')
                    var cadence=configForm.cadence;
                    console.log("Cadence is",cadence);
                    console.log("Time difference",(curTime-formReturned.dateOfPopup)/1000);

                    if(((curTime-formReturned.dateOfPopup)/1000)>cadence){
                    console.log(((curTime-formReturned.dateOfPopup)/1000));
                    formReturned,dateOfPopup=d;
                    formReturned.save();
                    res.send("pass");
                    }
                    else{
                        console.log(((curTime-formReturned.dateOfPopup)/1000));
                        console.log("cadence error");
                        res.send("cadence error");
                    }   
                }
            });

            }
        }
    });
});


app.post("/getScriptTag",(req,res)=>{
    //var username=req.body.username;
   var formId = req.body.id;
   // var formId = 
   console.log(formId);

   var script = `
   <script>
   $(document).ready(function()
   {   
       var dataString="anantha";
       $.ajax({
      type: "POST",
      url: "http://localhost:8080/getUserForm/${formId}/time",
      cache: false,
      data: {username:dataString},
      success: function(response){
      console.log(response);
      if(response=="pass"){
       var url=window.location.href;
       var dataString="anantha";
         $.ajax({
      type: "POST",
      url: "http://localhost:8080/getUserForm/${formId}",
      cache: false,
      data: {username:dataString,url:url},
      success: function(response){
      console.log(response);
      window.location.href=response;
      }
  });
      }
      }
  }); 
});
</script>`

console.log(typeof(script));
console.log(script)
res.send(script)
});

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("App started", host, port)
 })