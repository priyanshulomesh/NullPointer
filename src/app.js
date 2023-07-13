console.log("App started");
const express=require("express");
const hbs=require("hbs");
const mongoose=require("mongoose");
const routes=require('./routes/main');
const bodyParser=require('body-parser');
const session=require('express-session');



const app=express();

app.use(bodyParser.urlencoded({
  extended:true
}));

app.use('/static',express.static("public"));
app.use('',routes);


//template engine
app.set('view engine','hbs');
app.set('views'/*type*/ ,'views'/*folder name */);
hbs.registerPartials("./views/partials");

//db connection
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/site1');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}



app.listen(process.env.PORT | 80,()=>{
    console.log("server started");
});


