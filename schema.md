Admin:
Username:String, pwd:hash, prod_id(Prod)

Product:
_id, 
product_name:String
forms: [
  event:String,
  questions : [{
      type:String,
      questionText: String,
      isMandatory:boolean,
      options: [{ optionText: String, required: False }]
      }],
  frequency(cadence): Number,
  access_code:Number
]

User Feedback:
_id,
user_id:String,
submissions: [
  product_name,
  event,
  response: [{
    answers: [String]
  }]
  dateOfPopup: Date,
  isFormSubmitted:boolean
]

