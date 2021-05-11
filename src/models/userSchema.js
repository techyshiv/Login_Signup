const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    "name":{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    cpassword:{
        type:String,
        require:true
    },
    tokens:[
        {
            token:{
                type:String,
                require:true
            }
        }
    ]
});
// Hash password(before call save method)
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12);
        this.cpassword = await bcrypt.hash(this.cpassword,12);
    }
    next();
});

// We are generating token
userSchema.methods.generateAuthToken = async function(){
    try {
        let mytoken = jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:mytoken});
        await this.save();
        return mytoken;
    } catch (error) {
        console.log(error);
    }
}

const User = mongoose.model("CLIENT",userSchema);
module.exports = User;