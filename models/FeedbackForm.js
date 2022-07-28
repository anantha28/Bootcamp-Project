var mongoose=require("mongoose");

var FeedbackFormSchema=new mongoose.Schema({
    userId: String,
    formId: String,
    productName: String,
    eventName: String,
    response: [String],
    dateOfPopup: Number,
    isFormSubmitted: Boolean
    
});

module.exports=mongoose.model("FeedbackForm",FeedbackFormSchema);