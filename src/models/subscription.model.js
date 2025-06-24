import mongoose from "mongoose";

const subsSchema=new mongoose.Schema({
    subscriber:{

        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    channel:{
        type:mongoose.Schema.EventEmitter.Types.ObjectId,
        ref:User,
    },

},{timestamps:true})
export const Subscription=mongoose.model("Subscription",subsSchema)