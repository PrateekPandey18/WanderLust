const User = require("../models/user")

module.exports.signup = async(req,res)=>{
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
    
}
module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    delete req.session.redirectUrl;
    return res.redirect(redirectUrl)
}