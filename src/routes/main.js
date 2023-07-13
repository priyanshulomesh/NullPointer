const express = require("express");
const navDetail = require("../models/navDetail");
const serviceDetail = require("../models/service");
const async = require("hbs/lib/async");
const routes = express();
const contactDetail = require('../models/contact');
const loginDetail = require("../models/register");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const session = require("express-session");
const sessionDetail = require('../models/session');


routes.use(cookieParser());

routes.use(session({
    // key:'user_sid',
    secret: "login_session",
    resave: false,
    saveUninitialized: true,
    // cookie:{
    //     maxAge:1000*60*60//1 hour
    // }
}));







let isLogin = false;
let contactSubmit=false;
routes.get("/", async (req, res) => {
    console.log("refreshed");
    const navDetails = await navDetail.findOne({ "_id": "6444566abfffa4cbbb8dc552" });
    const serviceDetails = await serviceDetail.find();
    profile_data = await loginDetail.findOne({ email: req.session.email });
    // console.log(navDetails);
    // adjust(serviceDetails);
    isLogin = false;
    try {
        const sessionData = await sessionDetail.findOne({ email: req.session.email });
        //if found
        if (req.session.id == sessionData.sid) {
            //delete old session detail
            isLogin = true;
        }
    } catch (e) { }
    let submitContact=contactSubmit;
    contactSubmit=false;

    res.render("index", {
        navDetails: navDetails,
        profileData:profile_data,
        serviceDetails: serviceDetails,
        isLogin: isLogin,
        contactSubmit:submitContact
    });
});
routes.get("/about-us", async (req, res) => {
    const navDetails = await navDetail.findOne({ "_id": "6444566abfffa4cbbb8dc552" });
    profile_data = await loginDetail.findOne({ email: req.session.email });
    // console.log(navDetails);
    isLogin = false;

    try {
        const sessionData = await sessionDetail.findOne({ email: req.session.email });
        //if found
        if (req.session.id == sessionData.sid) {
            //same session
            isLogin = true;
        }
    } catch (e) { }

    res.render("about-us", {
        navDetails: navDetails,
        profileData:profile_data,
        isLogin: isLogin
    });
    // res.redirect('/');
});

// contactform
routes.post("/process-contact-form", async (req, res) => {
    profile_data = await loginDetail.findOne({ email: req.session.email });
    const id=req.session.email?req.session.email:"";
    try {
        const data = await contactDetail.create({
            query:req.body.query,
            email:req.body.email,
            accountId:id
        });
        console.log("Form submitted successfully");
        contactSubmit=true;

    } catch (e) {
        console.log(e);
    }
    res.redirect('/');
    // isLogin = false;
    // const navDetails = await navDetail.findOne({ "_id": "64474ce486d3ba8f0d4e04ce" });
    // const serviceDetails = await serviceDetail.find();
    // try {
    //     const sessionData = await sessionDetail.findOne({ email: req.session.email });
    //     //if found
    //     if (req.session.id == sessionData.sid) {
    //         //same session
    //         isLogin = true;
    //     }
    // } catch (e) { }

    // res.render("index", {
    //     navDetails: navDetails,
    //     profileData:profile_data,
    //     serviceDetails: serviceDetails,
    //     isLogin: isLogin
    // });

});

//registration


routes.post("/register", async (req, res) => {
    profile_data = await loginDetail.findOne({ email: req.session.email });
    let password_encrypted = "hello";
    try {

        password_encrypted = await bcrypt.hash(req.body.password, 12);
        // bcrypt.hash(req.body.password, 12/*key type cheez */);
        await loginDetail.create({
            email: req.body.email,
            password: password_encrypted,
            name:req.body.name
        });

        // res.send("login submitted successfully");
        console.log('Registered Successfully');


    } catch (e) {
        res.redirect("/registerPage")
    }
    res.redirect('/');
})

//login
routes.post("/login", async (req, res) => {
    profile_data = await loginDetail.findOne({ email: req.session.email });


    try {

        const userData = await loginDetail.findOne({ email: req.body.email });
        const comparePass = await bcrypt.compare(req.body.password, userData.password);
        if (comparePass) {

            // Check if the user is already logged in on another browser
            try {
                const sessionData = await sessionDetail.findOne({ email: req.body.email });
                //if found
                const existingSessionId = req.cookies['${req.body.email}-session-id'];
                if (req.session.id) {
                    //delete old session detail
                    await sessionDetail.deleteOne({ email: req.body.email });
                    //clear existing cookie
                    res.session.destroy();
                    res.clearCookie('${req.body.email}-session-id');
                    // Set the user's email in the session
                    req.session.email = req.body.email;
                    // Set a cookie with the user's email and the session ID
                    res.cookie('${req.body.email}-session-id', req.session.id);
                    try {
                        await sessionDetail.create({ email: req.body.email, sid: req.session.id });
                    } catch (e) { }
                }
            } catch (e) {
                //not found update db
                // Set the user's email in the session
                req.session.email = req.body.email;

                // Set a cookie with the user's email and the session ID
                res.cookie('${req.body.email}-session-id', req.session.id);
                try {
                    await sessionDetail.create({ email: req.body.email, sid: req.session.id });
                } catch (e) { console.log(e.message);}
            }
            isLogin = true;
            // const navDetails = await navDetail.findOne({ "_id": "64474ce486d3ba8f0d4e04ce" });
            // const serviceDetails = await serviceDetail.find();
            // console.log(req.session.id);

            // res.render("index", {
            //     navDetails: navDetails,
            //     profileData:profile_data,
            //     serviceDetails: serviceDetails,
            //     isLogin: isLogin,
            // });
        }
        else {
            // res.send("wrong password");
            isLogin=false;
        }
        res.redirect("/");

    } catch (e) {
        console.log(e.message);
        res.send("wrong details");
    }
});


routes.post('/logout', async (req, res) => {
    profile_data = await loginDetail.findOne({ email: req.session.email });

    // Check if the user is already logged in on another browser
    isLogin = true;
    const navDetails = await navDetail.findOne({ "_id": "6444566abfffa4cbbb8dc552" });
    const serviceDetails = await serviceDetail.find();
    try {
        const sessionData = await sessionDetail.findOne({ email: req.session.email });
        //if found
        if (req.session.id == sessionData.sid) {
            isLogin = false;
            //delete old session detail
            await sessionDetail.deleteOne({ email: req.body.email });
            //clear existing cookie
            res.session.destroy();
            try { res.clearCookie('${req.body.email}-session-id'); } catch (e) { }
        }
    } catch (e) { }

    res.render("index", {
        navDetails: navDetails,
        serviceDetails: serviceDetails,
        isLogin: isLogin,
    });
});




//profile

routes.get("/profile", async (req, res) => {
    isLogin = false;

    const navDetails = await navDetail.findOne({ "_id": "6444566abfffa4cbbb8dc552" });
    const serviceDetails = await serviceDetail.find();
    try {
        const sessionData = await sessionDetail.findOne({ email: req.session.email });
        //if found
        if (req.session.id == sessionData.sid) {
            //same session
            isLogin = true;
        }
    } catch (e) { }

    if (isLogin) {
        // const navDetails = await navDetail.findOne({ "_id": "6444566abfffa4cbbb8dc552" });
        const profile_data = await loginDetail.findOne({ email: req.session.email });
        console.log(req.session.email);

        res.render("profile", {
            navDetails: navDetails,
            profileData:profile_data,
            isLogin: isLogin,
        });
    }
    else{
        res.redirect('/');
    }
});

routes.post("/profile", async (req, res) => {



    isLogin = false;

    const navDetails = await navDetail.findOne({ "_id": "6444566abfffa4cbbb8dc552" });
    const serviceDetails = await serviceDetail.find();
    try {
        const sessionData = await sessionDetail.findOne({ email: req.session.email });
        //if found
        if (req.session.id == sessionData.sid) {
            //same session
            isLogin = true;
        }
    } catch (e) { }
    if(isLogin){
        password_encrypted = await bcrypt.hash(req.body.password, 12);
        let profile_data = await loginDetail.findOne({ email: req.session.email });
        await loginDetail.updateOne({ email: req.session.email }, { $set: { password: password_encrypted } });
        await loginDetail.updateOne({ email: req.session.email }, { $set: { name: req.body.name } });
        profile_data = await loginDetail.findOne({ email: req.session.email });

        res.render("profile", {
            navDetails: navDetails,
            profileData:profile_data,
            isLogin: isLogin,
        });
    }
    else{
        res.render("index", {
            navDetails: navDetails,
            profileData:profile_data,
            serviceDetails: serviceDetails,
            isLogin: isLogin,
        });
    }

    
});

routes.post('/deleteAccount',async (req,res)=>{
    const navDetails = await navDetail.findOne({ "_id": "6444566abfffa4cbbb8dc552" });
    const serviceDetails = await serviceDetail.find();
    profile_data = await loginDetail.findOne({ email: req.session.email });
    console.log(req.session.email);
    if(await bcrypt.compare(req.body.deletePassword,profile_data.password)){
        //match
        await loginDetail.deleteOne({email:req.session.email});
        isLogin = false;
            //delete old session detail
            res.render("index", {
                navDetails: navDetails,
                profileData:profile_data,
                serviceDetails: serviceDetails,
                isLogin: isLogin,
            });
    }
    else{
        res.render("profile", {
            navDetails: navDetails,
            profileData:profile_data,
            isLogin: isLogin,
        });
    }

});

module.exports = routes