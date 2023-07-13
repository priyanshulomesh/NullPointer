const mongoose=require("mongoose");
const serviceDetail=mongoose.Schema(
    {
        icon:String,
        title:String,
        description:String,
        linkText:String,
        link:String
    }
)
const serviceModel=mongoose.model("service",serviceDetail);
module.exports=serviceModel;