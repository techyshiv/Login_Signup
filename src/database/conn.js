const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=>{
    console.log("Connection Successfull.......");
}).catch((error)=>{
    console.log(`Error Occured While Connecting is = ${error}`);
})