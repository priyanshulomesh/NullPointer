const mongoose=require('mongoose');
const sessionData=mongoose.Schema({
    email:{
        type:String,
        unique:true
    },
    sid:String
});
module.exports=mongoose.model('session',sessionData);