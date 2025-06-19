import mongoose,{Schema,model} from "mongoose";
import mongooseAggregatePaginate  from "mongoose-aggregate-paginate-v2";
const videoSchema=new Schema({
    videoFile:{
<<<<<<< HEAD
        type:String,
=======
        type:String, //Cloudinary
>>>>>>> 081ce2f (Fixed Issues and Modified overall code)
        required:true, 
    },
    thumbnail:{
        type:String,
        required:true,

    },
    title:{
        type:String,
        required:true,

    },
    description:{
        type:String,
        required:true,

    },
    duration:{
<<<<<<< HEAD
        type:Number, //Cloudi
=======
        type:Number, //Cloudinary
>>>>>>> 081ce2f (Fixed Issues and Modified overall code)
        required:true,
    },
    view:{
        type:Number,
        defaul:0,
    },
    isPublished:{
        type:Boolean,
        default:true,

    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video= model("Video",videoSchema)