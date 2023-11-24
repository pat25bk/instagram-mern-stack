const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        comment:{
            type:String,
            required:true,
            trim:true,
        }
    },
    { timestamps: true }
)

const postSchema = new mongoose.Schema({
    caption:{
        type: String,
        trim: true
    },
    image:{
        type:String
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    comments:[commentSchema],
    savedBy:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    },
    { timestamps: true }
)

module.exports = mongoose.model("Post",postSchema);