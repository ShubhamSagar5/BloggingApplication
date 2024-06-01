import { asyncHandler } from "../middleware/catchAsyncError.js"
import ErrorHandler from "../middleware/error.js"
import { User } from "../models/userSchema.js"



export const register = asyncHandler(async(req,res,next)=>{

    const {name,email,password,phone,role,education} = req.body 

    if(!name || !email || !password || !phone || !role || !education){
        return next(new ErrorHandler("Please Fill Full Details",400))
    }

    let user = await User.findOne({email})

    if(user){
        return next (new ErrorHandler("User Already Register",400))
    }

    user = await User.create({
        name,
        email,
        password,
        phone,
        role,
        education
    }

   
)
 return res.status(200).json({
        success:true,
        message:"User Register Successfully"
    })
})


export const login = asyncHandler(async(req,res,next)=>{

    const {email,password,role} = req.body 

    if(!email || !password || !role){
        return next(new ErrorHandler("Please Provide All Deatils",400))
    }

    let user = await User.findOne({email})

    if(!user){
        return next(new ErrorHandler("User Not Found Please Provide valid Email"))
    }

    const checkPasswordIsValid = await user.isPasswordCorrect(password)

    if(!checkPasswordIsValid){
        return next (new ErrorHandler("Password Is Incorrect Please Provide Valid Password"))
    }

    if(role !== user.role){
        return next(new ErrorHandler("User Role Not Match with Existing User"))
    }

    return res.status(200).json({
        success:true,
        message:"User login successfully"
    })
})