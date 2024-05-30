import mongoose from 'mongoose'


export const dbConnection = ()=>{
    mongoose.connect(process.env.MONGODB_URI,{
        dbName:"BlogApplication"
    }).then(()=>{
        console.log("Database connect successfully")
    }).catch((err)=>{
        console.log("Something error occur while connecting to database " + err)
    })
} 