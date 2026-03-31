const Listing = require("../models/listing")

module.exports.index = async (req,res) =>{
    const allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings})
}

module.exports.renderNewForm = (req,res)=>{
    
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id).populate({path: "reviews", populate: {path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error", "the listing you requested doesnot exist")
        return res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async(req,res,next)=>{
    
        // let {title,description,image,price,country,location} = req.body;
    const listing = new Listing(req.body.listing)
    listing.owner = req.user._id;
    console.log(listing)
    await listing.save();
    req.flash("success", "new listing created")
    res.redirect("/listings")
    // console.log(listing);

    
    
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "the listing you requested doesnot exist")
        return res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params
    console.log(id);
    
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "listing updated")
    res.redirect(`/listings/${id}`);
    
}

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted")
    res.redirect("/listings");

}