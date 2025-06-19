import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app=express()

app.use(cors({
    origin: process.env.CORS_ORIGIN || "https://localhost:8080"
}))

<<<<<<< HEAD
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static("public"))
=======
// to accept json format of data
app.use(express.json({limit:'16kb'}))

// to accept and encode data coming from url
app.use(express.urlencoded({extended:true,limit:'16kb'}))

// to accept public assests
app.use(express.static("public"))

>>>>>>> 081ce2f (Fixed Issues and Modified overall code)
app.use(cookieParser())

//routes import 
import userRouter from './routes/user.routes.js'
<<<<<<< HEAD
//routes Declaration
app.use('/api/v1/users',userRouter)
=======

//routes Declaration
app.use('/api/v1/users',userRouter)

>>>>>>> 081ce2f (Fixed Issues and Modified overall code)
export default app

 