const Listing=require("./models/listing")
const Review=require("./models/review")
const {reviewSchema,listingSchema}=require("./schema")
const ExpressError=require("./utils/ExpressError")


module.exports.isLoggedIn=((req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl
        req.flash("error","You need to logged in first")
        return res.redirect("/login")
    }
    next()
})

//for redirect to that page where we ask for login
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
        res.locals.redirectUrl=req.session.redirectUrl
    next()
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params
    let listing=await Listing.findById(id)
    if(!listing.owner._id.equals(res.locals.currUser._id))
        {
            req.flash("error","You are not the owner") 
            return res.redirect(`/listing/${id}`)
        }
    next()

}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params
    console.log(reviewId);
    
    let review=await Review.findById(reviewId)
    // console.log(review);
    
    if(!review.author.equals(res.locals.currUser._id))
        {
            req.flash("error","You are not the owner") 
            return res.redirect(`/listing/${id}`)
        }
    next()

}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body)
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,error.errmsg)
    }
    else
        next()
 
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body)
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,error.errmsg)
    }
    else
        next()
 
}