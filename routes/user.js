const express = require("express")
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController  = require("../controllers/users.js")

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",userController.signup);

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login", saveRedirectUrl,passport.authenticate("local", {failureRedirect: "/login", failureFlash:true}),userController.login)

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