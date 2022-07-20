var mongoose=require("mongoose");

var FeedbackFormSchema=new mongoose.Schema({
    userId: String,
    productId: String,
    productName: String,
    eventName: String,
    response: [String],
    dateOfPopup: Date,
    isFormSubmitted: Boolean
    
});

module.exports=mongoose.model("FeedbackForm",FeedbackFormSchema);