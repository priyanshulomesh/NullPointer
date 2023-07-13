const mongoose=require("mongoose");

const loginDetails=mongoose.Schema({
    email:
    {
        type:String,
        unique:true
    },
    password:String,
    name:String
});

const loginModel=mongoose.model("Login",loginDetails);

module.exports=loginModel;

