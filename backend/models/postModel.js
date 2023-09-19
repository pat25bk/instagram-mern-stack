const mongoose = require("mongoose");

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
    comments:[
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
    ],
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