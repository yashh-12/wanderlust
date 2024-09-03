const mongoose=require("mongoose")
const Listing=require("/home/yash/WebDevelopment/MegaProject/models/listing.js")
const data=require("./data.js")

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
    .then((res)=>{
        console.log("updated");
        
    })
    .catch((err)=>{
        console.log(err);
        
    })

const initdb=async ()=>{
    await Listing.deleteMany()
    data.data=data.data.map((obj)=>({...obj,owner:'66d2068cceda470ac86f3c00'}))
    await Listing.insertMany(data.data)
    console.log("data was intialized");
    
}

initdb()

