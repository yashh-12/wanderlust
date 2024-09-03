const express=require("express")
const router=express.Router()
const ExpressError=require("../utils/ExpressError")
const Listing=require("/home/yash/WebDevelopment/MegaProject/models/listing.js")
const wrapAsync=require("../utils/wrapAsync")
const {isLoggedIn, isOwner, validateListing}=require("../middleware")
const listingcontroller=require("../controllers/listing")
const multer  = require('multer')
const { storage } = require("../cloudfiles")
const upload = multer({ storage })


router
    .route("/")
    //index route
    .get(wrapAsync(listingcontroller.index))
    //create listing
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingcontroller.createListing))
   
//New route
router.get("/new",isLoggedIn,wrapAsync(listingcontroller.renderNewForm))

// edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingcontroller.renderEditForm))

router
    .route("/:id")
    //Show route
    .get(wrapAsync(listingcontroller.showListing))
    //Update Route
    .patch(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingcontroller.editListing))
    //Delete Route
    .delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.destroyListing))


module.exports=router;