var mongoose=require("mongoose");

var FeedbackSchema=new mongoose.Schema({
    comments:String,
    starRating:String
});

module.exports=mongoose.model("Feedback",FeedbackSchema);