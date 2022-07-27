var mongoose=require("mongoose");

var tempUserSchema=new mongoose.Schema({
    username:String
});

module.exports=mongoose.model("tempUser",tempUserSchema);