import mongoose ,{Schema} from "mongoose";
import  jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
const userSchema= new Schema({
    userName:{
        type:String,
        required:true, 
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required:true, 
        unique:true,
        lowercase:true,
        trim:true,
       
    },
    fullName:{
        type:String,
        required:true, 
        trim:true,
        index:true,
    },
    avatar:{
        type:String, //Cloudinary Service
        required:true, 
        trim:true,
        index:true,
    },
    coverImage:{
        type:String,
        trim:true,
        index:true,
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    refreshToken:{
        type:String  
    }

},{timestamps:true})
<<<<<<< HEAD
=======

>>>>>>> 081ce2f (Fixed Issues and Modified overall code)
//Encrypting the password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password,10)
    next()
})

<<<<<<< HEAD
userSchema.methods.isPasswordCorrect=async function(){
    return await bcrypt.compare("password",this.password)
}
userSchema.methods.generateAccessToken=function(){
    jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
=======
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=function(){
   return  jwt.sign({
        _id:this._id,
        email:this.email,
        userName:this.userName,
        fullName:this.fullName
>>>>>>> 081ce2f (Fixed Issues and Modified overall code)
    
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken=function(){
<<<<<<< HEAD
    jwt.sign({
        _id:this._id,
       
    
=======
   return jwt.sign({
        _id:this._id,
        
>>>>>>> 081ce2f (Fixed Issues and Modified overall code)
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.RFRESH_TOKEN_EXPIRY
    }
)
    

}

export const User=mongoose.model("User",userSchema)