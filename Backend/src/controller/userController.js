import { asyncHandler } from "../middleware/catchAsyncError.js"
import ErrorHandler from "../middleware/error.js"
import { User } from "../models/userSchema.js"
import { sendToken } from "../utils/sendToken.js"
import cloudinary from 'cloudinary'


export const register = asyncHandler(async(req,res,next)=>{

    const {avatar} = req.files 

    const allowedTypes = ["image/png","image/jpeg","image/webp"] 

    if(!allowedTypes.includes(avatar.mimetype)){
        return next(new ErrorHandler("File Type Not Support.Only Png,Jpeg,Webp Types are Allowed",400))
    }

    if(!avatar || Object.keys(req.files.avatar).length == 0 ){
        return next(new ErrorHandler("please upload Avatar image"))
    }

    const {name,email,password,phone,role,education} = req.body 

    if(!name || !email || !password || !phone || !role || !education || !avatar){
        return next(new ErrorHandler("Please Fill Full Details",400))
    }

    let user = await User.findOne({email})

    if(user){
        return next (new ErrorHandler("User Already Register",400))
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath)

    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return next(
        new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
      );
    }

    user = await User.create({
        name,
        email,
        password,
        phone,
        role,
        education,
        avatar:{
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
    }

   
)

sendToken(user,200,"User Register Successfully",res)


})


export const login = asyncHandler(async(req,res,next)=>{

    const {email,password,role} = req.body 

    if(!email || !password || !role){
        return next(new ErrorHandler("Please Provide All Deatils",400))
    }

    let user = await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorHandler("User Not Found Please Provide valid Email"))
    }

    const checkPasswordIsValid = await user.isPasswordCorrect(password)

    if(!checkPasswordIsValid){
        return next (new ErrorHandler("Password Is Incorrect Please Provide Valid Password"))
    }

    if(role !== user.role){
        return next(new ErrorHandler(`User Role "${role}" Not Match with Existing User`))
    }

    // let userData = await User.findOne({email})

    sendToken(user,200,"User login successfully",res)

    
})


export const logout = async(req,res,next)=> {
    try {
        
        res.status(200).cookie("token",null,{
            expires: new Date(Date.now()),
            httpOnly:true,
            secure:true,
            sameSite:"None"
        }).json({
            success:true,
            message:"User LogOut Successfully"
        })

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}


export const getMyProfile = async(req,res,next)=>{

    try {
        const user = req.user 
    
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User Profile Not Found Please Login "
            })
        }
    
        return res.status(200).json({
            success:true,
            message:"user information Get Successfully",
            user
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }

}

export const getAllAuthor = asyncHandler(async(req,res,next)=>{

    const author = await User.find({role:"Author"}) 

    if(!author){
        return next(new ErrorHandler("No Author Found ",404))
    }

    return res.status(200).json({
        success:true,
        message:"Author Get Successfully",
        author
    })
})