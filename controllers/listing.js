const Listing=require("../models/listing")
module.exports.index=async (req,res)=>{
    let alllist=await Listing.find();
    // console.log(alllist);
    
    res.render("listing/index.ejs",{alllist})
}
module.exports.renderNewForm=async (req,res)=>{
    res.render("listing/new")
}

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params
    let alllist=await Listing.findById(id)
    // console.log(alllist);
    if(!alllist)
    {
            req.flash("error","Listing you requested does not exist")
            res.redirect("/listing")
    }
    res.render("listing/edit",{alllist})
    
}

module.exports.createListing=async (req,res)=>{
    let url=req.file.path
    let filename=req.file.filename
    
    const newListing=new Listing(req.body.listing)
    newListing.owner=req.user._id
    newListing.image={url,filename}
    await newListing.save()  
    req.flash("success","New Listing created") 
    res.redirect("/listing")
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params
    let alllist=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    // console.log(alllist);    
    if(!alllist)
    {
            req.flash("error","Listing you requested does not exist")
            res.redirect("/listing")
    }
    // console.log(alllist.owner);
        
    res.render("listing/show.ejs",{alllist})
}

module.exports.editListing=async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Enter valid Data")
    }
    let {id}=req.params
    
    let result=await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(req.file)
    {
        let url=req.file.path
        let filename=req.file.filename
        result.image={url,filename}
        result.save()
    }
    req.flash("success","Listing edited") 
    res.redirect(`/listing/${id}`)
     
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params
    // console.log(id);
    
    await Listing.findByIdAndDelete(id)
    req.flash("success","Listing Deleted") 

    res.redirect(`/listing`)
     
}