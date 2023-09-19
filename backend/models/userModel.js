const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter name"]
    },
    email:{
        type:String,
        required:[true,"Please enter email"]
    },
    username:{
        type:String,
        required:[true,"Please enter username"],
        unique:[true,"User already exists"],
        minlength:[6,"Username must contain at least 6 characters"]
    },
    password:{
        type:String,
        required:[true,"Please enter password"],
        minlength:[6,"Password must be of minimum 6 characters"],
        select: false,
    },
    avatar:{
        type:String
    },
    bio:{
        type:String,
        default:"Hi👋 Welcome To My Profile"
    },
    website:{
        type:String,
        trim:true
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    saved:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    resetPasswordToken:String,
    resetPasswordExpiry:Date,
})


userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


userSchema.methods.verifyPassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateToken = function(){
    return jwt.sign (
        {id: this._id}, //payload
        process.env.JWT_SECRET,//secret key
        {expiresIn:process.env.JWT_EXPIRE}//options
    )
}

module.exports = mongoose.model("User",userSchema);