const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("../schema.js")
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})



//Index.route
router.get("/",wrapAsync(listingController.index))

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm)
//show route
router.get("/:id",wrapAsync(listingController.showListing))

//create route
router.post("/",isLoggedIn,validateListing,upload.single("listing[image]"),wrapAsync( listingController.createListing ))

//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderEditForm))

//update route
router.put("/:id",isLoggedIn,isOwner,wrapAsync(listingController.updateListing))

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))

module.exports = router;