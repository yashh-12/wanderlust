if(process.env.NODE_ENV!="production")
require("dotenv").config()

const express=require("express")
const mongoose=require("mongoose")
const path=require("path")
const methodOverride=require("method-override")
const { log } = require("console")
const ejsmate=require("ejs-mate")
const ExpressError=require("./utils/ExpressError")
const session=require("express-session")
const flash=require("connect-flash")
const passport=require("passport")
const localStrategy=require("passport-local")
const User=require("./models/user")

//all routes
const listingsRouter=require("./routes/listing")
const reviewsRouter=require("./routes/review")
const userRouter=require("./routes/user")

const app=express()

app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(methodOverride("_method"))
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.engine("ejs",ejsmate)

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
    .then((res)=>{
        console.log("Connected");
        
    })
    .catch((err)=>{
        console.log(err);
        
    })

// let user=mongoose.model("user",userScheme)

app.get("/",(req,res)=>{
    res.send("APP is working")  
})

let sessionOptions={
    secret:"Mytopsecretkey",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}
app.use(session(sessionOptions))
app.use(flash())

//Passport should must be used after session middleware
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user
    next()
})


app.use("/listing",listingsRouter)
app.use("/listing/:id/reviews",reviewsRouter)
app.use("/",userRouter)

//serves all incoming reqeust that is not defined
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})

app.use((err,req,res,next)=>{
    let {statuscode=500,message="something went wrong"}=err
    res.status(statuscode).render("listing/error",{message})
})

app.listen(8080,()=>{
    console.log("server is running");
    
})