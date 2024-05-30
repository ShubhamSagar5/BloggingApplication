import app from "./app.js";


app.listen(process.env.PORT,()=>{
    console.log(`Serevr is listen on PORT No ${process.env.PORT}`)
})