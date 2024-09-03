const cookieParser = require("cookie-parser")
const express=require("express")
const app=express()
const session=require("express-session")
const flash=require("connect-flash")
const path=require("path")

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(flash())
app.use(session({
    secret:"Thisismymostsecretket",
    saveUninitialized:true,
    resave:false
}))

app.use((req,res,next)=>{
    res.locals.msg=req.flash("success")
    res.locals.err=req.flash("error")
    next()
})

app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query
    req.session.name=name
    if(name==="anonymous")
        req.flash("error","User not registerd")
    else
        req.flash("success","User successfully registerd")

    res.redirect("/home")
}) 

app.get("/home",(req,res)=>{
       

        res.render("show",{name:req.session.name})
})

app.listen(3000,()=>{
    console.log("Server is running");
    
})