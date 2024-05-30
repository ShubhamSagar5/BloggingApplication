import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import expressFileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'
import { dbConnection } from './database/dbConnection.js'

const app = express()

dotenv.config({
    path:"./config/config.env"
})


app.use(cors({
    origin:[],
    methods:["GET","PUT","POST","DELETE"],
    credentials:true
}))

app.use(express.json())
app.use(expressFileUpload({
   useTempFiles:true,
     tempFileDir:"/temp/"
}))

app.use(express.urlencoded({
    extended:true
}))

app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send(`<h2>Hello Blog Application Backend</h2>`)
})

dbConnection()

export default app