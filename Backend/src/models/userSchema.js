import mongoose from 'mongoose'
import validator from 'validator'

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:[3,"Name Must Contain at Least 3 Character"],
        maxLength:[10,"Name Should Not Exceeding More Than 10 Character"]
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,"Please Provide Valid Email"]
    },
    phone:{
        type:String,
        required:true,
        maxLength:[15,"Phone Number Not Exceeding More Than 15 Digit"]
    },
    avatar:{
        public_id:{
        type:String,
        },
        url:{
            type:String,
        }
    },
    education:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:["Reader","Author"]
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"Password Contain atleast 8 Character"],
        maxLength:[10,"Password Not Exceeding More Than 10 Character"]
    },
    createdOn:{
        type:Date,
        default:Date.now
    }
})


export const User = mongoose.model("User",userSchema)