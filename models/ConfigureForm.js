var mongoose=require("mongoose");

var ConfigureFormSchema=new mongoose.Schema({
    productname: String,
    productId:String,
    forms: [{
        event: String,
        questions: [{
            type: String,
            questionText: String,
            isMandatory: Boolean,
            options: [{
                optionText: String,
                requires: false,
            }]
        }],
    cadence: Number,
    access_code: Number
    }],
});

module.exports=mongoose.model("ConfigureForm",ConfigureFormSchema);