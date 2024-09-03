const User=require("../models/user")

module.exports.renderSignupPage=(req,res)=>{
    res.render("users/signup")
}

module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body
    let newUser=new User({username,email})
    ress=await User.register(newUser,password)
    console.log(ress);
    req.login(ress,(err)=>{
        if(err)
            next(err)
    req.flash("success","Welcome to WanderLust")
    res.redirect("/listing")

    })
    
    }catch(er){
        req.flash("error",er.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginPage=(req,res)=>{
    res.render("users/login")
}

module.exports.login=(req,res)=>{
    req.flash("success","Welcome to WanderLust")
    let redirectUrl=res.locals.redirectUrl || "/listing"
    res.redirect(redirectUrl)
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
    if(err)
        next(err)
    req.flash("success","Logged Out successfully")
    res.redirect("/listing")
    })
}