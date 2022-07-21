var mongoose=require("mongoose");

var ConfigureFormSchema=new mongoose.Schema({
    productName: String,
    productId:String,
    event: String,
    questions: [{
        type: String,
        questionText: String,
        isMandatory: Boolean,
        options: [{
            optionText: String,
            required: false,
        }]
    }],
    cadence: Number,
    accessCode: Number
});

module.exports=mongoose.model("ConfigureForm",ConfigureFormSchema);