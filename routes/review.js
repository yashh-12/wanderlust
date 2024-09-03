const express=require("express")
//we have to set merge params to true for fetting params from listing route
const router=express.Router({mergeParams:true})
const Review=require("/home/yash/WebDevelopment/MegaProject/models/review.js")
const Listing=require("/home/yash/WebDevelopment/MegaProject/models/listing.js")
const wrapAsync=require("../utils/wrapAsync")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware")

const reviewController=require("../controllers/review")

//reviews
//post create review
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

module.exports=router