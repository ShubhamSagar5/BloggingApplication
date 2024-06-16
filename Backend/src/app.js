import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import expressFileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'
import { dbConnection } from './database/dbConnection.js'
import { errorMiddleware } from './middleware/error.js'
import userRouter from './routes/userRoutes.js'
import blogRouter from './routes/blogRoutes.js'

const app = express()

dotenv.config({
    path:"./config/config.env"
})


app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods:"GET,PUT,POST,DELETE",
    credentials:true,
   
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.use(expressFileUpload({
   useTempFiles:true,
   tempFileDir:"/tmp/"
}))





app.get("/",(req,res)=>{
    res.send(`<h2>Hello Blog Application Backend</h2>`)
})

app.use('/api/v1/user',userRouter)
app.use('/api/v1/blog',blogRouter)


dbConnection()

app.use(errorMiddleware)

export default app