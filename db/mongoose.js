const mongoose = require("mongoose")
const mongodbUrl = process.env.MONGO_URL || '';

mongoose.connect(mongodbUrl).then(()=>{
    console.log("DB Connection Established")
}).catch((e)=>{
    console.log(e)
})