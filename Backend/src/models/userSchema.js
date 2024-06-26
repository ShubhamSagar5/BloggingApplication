import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
        maxLength:[10,"Password Not Exceeding More Than 10 Character"],
        select: false,
    },
    createdOn:{
        type:Date,
        default:Date.now
    }
})


userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10) 
    }
    next()

})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateToken = function () {
    return jwt.sign({id:this._id},process.env.JWT_SECRETKEY,{
        expiresIn:process.env.JWT_EXPIRE
    })
}


export const User = mongoose.model("User",userSchema)