// require('dotenv').config()
import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import app  from './app.js';
<<<<<<< HEAD
=======

>>>>>>> 081ce2f (Fixed Issues and Modified overall code)
dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
<<<<<<< HEAD
   app.listen(process.env.PORT || 8080,()=>{
    console.log("App Running")
   })
}).catch((err)=>{
    console.log("error",err)
=======
   app.listen(process.env.PORT || 3000,()=>{
    console.log("App listening to port",process.env.PORT)
   })
}).catch((err)=>{
    console.log("Mongo DB connection failed",err)
>>>>>>> 081ce2f (Fixed Issues and Modified overall code)
})
   

