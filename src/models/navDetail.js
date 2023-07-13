const mongoose=require("mongoose");
const navDetail=mongoose.Schema(
    {
        brandName:String,
        brandIconUrl:String,
        links:[
            {
                label:String,
                url:String,
            },
        ],
    }
);
const navModel=mongoose.model("navDetail",navDetail);
module.exports=navModel;