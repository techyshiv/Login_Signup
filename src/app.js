const dotenv = require("dotenv");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 8000;
// Env file 
dotenv.config({path:'./config.env'});
// Require database
require("./database/conn");
// To understand json data
app.use(express.json());
// cookie use as a middleware
app.use(cookieParser());
// Require routers file
app.use(require('./routers/auth'));

// MiddelWare
const middleware = (req,res,next)=>{
    console.log('Hello From Middleware');
    next();
}

app.get("/about",middleware,(req,res)=>{
    console.log("Hello From About");
    res.send("About is Visible");
});

app.get("/login",(req,res)=>{
    res.send("Login is Visible");
});

app.get("/signup",(req,res)=>{
    res.send("SignUp is Visible");
});

app.get("/contact",(req,res)=>{
    res.send("Contact is Visible");
})

app.listen(port,()=>{
    console.log(`Server Listening on Port Number = ${port}`);
});