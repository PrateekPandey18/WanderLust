const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const sessionOptions = {secret: "verysecret",resave: false, saveUninitialized:true}

app.use(session(sessionOptions));
app.use(flash())
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));

app.get("/register", (req,res) =>{
    let {name = "anonymous"}= req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error", "user not found")
    
    }else{
        req.flash("success","user registered successfully")

    }
    res.redirect("/hello");
    
})

app.get("/hello", (req,res) =>{
    res.locals.err = req.flash("error");
    res.locals.suc = req.flash("success");
    res.render("page.ejs",{name: req.session.name })
    // msg: req.flash("success")
})

// app.get("/test", (req,res) =>{
//     if(req.session.count){
//         req.session.count++; delete recieve
//     }else{
//     req.session.count =1;
//     }
//     res.send(`you sent request${req.session.count}`);
// } ) 

app.listen(3000, ()=>{
    console.log("working")
})