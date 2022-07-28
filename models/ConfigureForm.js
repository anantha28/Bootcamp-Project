var mongoose=require("mongoose");

var ConfigureFormSchema=new mongoose.Schema({
    productName: String,
    username: String,
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
    accessCode: Number,
    url: String
}, 
{ typeKey: '$type' });

module.exports=mongoose.model("ConfigureForm",ConfigureFormSchema);