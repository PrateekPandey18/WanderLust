const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("../schema.js")
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")




//Index.route
router.get("/",wrapAsync(async (req,res) =>{
    const allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings})
}))

//new route
router.get("/new",isLoggedIn,(req,res)=>{
    
    res.render("listings/new.ejs");
})
//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id).populate({path: "reviews", populate: {path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error", "the listing you requested doesnot exist")
        return res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing});
}))

//create route
router.post("/",validateListing, wrapAsync(async(req,res,next)=>{
    
        // let {title,description,image,price,country,location} = req.body;
    const listing = new Listing(req.body.listing)
    listing.owner = req.user._id;
    console.log(listing)
    await listing.save();
    req.flash("success", "new listing created")
    res.redirect("/listings")
    // console.log(listing);

    
    
}))
//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "the listing you requested doesnot exist")
        return res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing});
}))

//update route
router.put("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id} = req.params
    console.log(id);
    
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "listing updated")
    res.redirect(`/listings/${id}`);
    
}))

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted")
    res.redirect("/listings");

}))

module.exports = router;