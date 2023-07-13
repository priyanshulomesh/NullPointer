
mongoose=require('mongoose');

const contactDetails=mongoose.Schema({
    email:String,
    query:String,
    accountId:String
});

contactModel=mongoose.model('query',contactDetails);


module.exports=contactModel;