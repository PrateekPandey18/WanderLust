const express = require("express")
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",async(req,res)=>{
    try{
        let{username, email,password} = req.body;
        const newUser = new User({email,username});
        const registered= await User.register(newUser, password)
        console.log(registered)
        req.login(registered,(err)=>{
            if(err){
                return next(err);
                
            }
            req.flash("success", "Welcome to WanderLust!");
            return res.redirect("/listings")
        })
        
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
    
});

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login", saveRedirectUrl,passport.authenticate("local", {failureRedirect: "/login", failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
})

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you have logged out successfully")
        res.redirect("/listings")
    })
})

module.exports = router;