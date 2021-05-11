const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
require("../database/conn");
const User = require("../models/userSchema");
const verify = require("../middleware/verify");

router.get("/",(req,res)=>{
    res.send("Hello World From Router File");
});

// <---------------------- Using Promises --------------------------------->
// router.post("/register",(req,res)=>{
//     const { name,email,password,cpassword } = req.body;
//     // Check Validation from Backend Side
//     if(!name || !email || !password || !cpassword){
//         return res.status(422).json({error:"Plz Filled all data!!"});
//     }

//     User.findOne({email:email})
//     .then((userExist)=>{
//         if(userExist){
//             return res.status(422).json({error:"Email Already Exist!!"});
//         }
//         const user = new User({name,email,password,cpassword});
//         user.save().then(()=>{
//             res.status(201).json({success:"User Registerd Successfully"});
//         }).catch((err)=>{
//             res.status(500).json({error:"Failed to registerd"});
//         });
//     }).catch((err)=>{
//         res.status(500).json({error:"Invalid credientials"});
//     });
//     // console.log(req.body);
//     // res.json({message:req.body});
//     // res.send("Post Method Called");
// });

// <-------------------------------- using async await ------------------------------->
// SignUp Route
router.post("/register",async (req,res)=>{
    const { name,email,password,cpassword } = req.body;
    // Check Validation from Backend Side
    if(!name || !email || !password || !cpassword){
        return res.status(422).json({error:"Plz Filled all data!!"});
    }

    try{
        const userExist = await User.findOne({email:email})
        if(userExist){
            return res.status(422).json({error:"Email Already Exist!!"});
        }else if(password != cpassword){
            return res.status(422).json({error:"Password and Cpassword Not Match"});
        }else{
            const user = new User({name,email,password,cpassword});
            // Hash Password
            // Call in userschema file
            const userRegistered = await user.save();
            if(userRegistered){
                res.status(201).json({success:"User Registerd Successfully"}); 
            }
        }
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to registerd"});
    }

});

// Login Route
router.post('/login',async (req,res)=>{
    try {
        let token;
        const { email,password } = req.body;
        if(!email || !password){
            return res.status(400).json({error:"Please fill the data"});
        }
        const userLogin = await User.findOne({email:email});
        if(userLogin){
            const isMatch = await bcrypt.compare(password,userLogin.password);
            // generate token
            token = await userLogin.generateAuthToken();
            // console.log(token);
            // Store token in cookies
            res.cookie("jwt",token,{
                expires:new Date(Date.now() + 50000),
                httpOnly:true
                // secure:true
            });
            if(!isMatch){
                res.status(400).json({error:"Invalid Credientials"});
            }else{
                res.status(200).json({success:"User Signin Successfully"});
            }
        }else{
            res.status(400).json({error:"Invalid Credientials"});
        }
        
    } catch (error) {
        res.status(500).json({error:"Login Failed"});        
    }
});

// About Route
router.get("/about",verify,(req,res)=>{
    console.log(`JWT = ${req.cookies.jwt}`);
    if(req.cookies.jwt){
        res.status(200).json({mess:"Token Verified"});
    }else{
        res.status(401).json({error:"Session Timeout"});
    } 
});

// Logout Route
router.get("/logout",verify,async (req,res)=>{
    try {
        // Logout only one device
        req.user.tokens = req.user.tokens.filter((currElem)=>{
            return currElem.token != req.token;
        });

        // Logout From all device
        // res.user.tokens = [];

        res.clearCookie("jwt");
        console.log("Logout Successfully");
        await req.user.save();
        res.status(200).json({success:"Logout Successfully"});
    } catch (error) {
        res.status(500).json({error:error});
    }
});

module.exports = router;