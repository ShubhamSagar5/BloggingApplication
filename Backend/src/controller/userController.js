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
        return next (new ErrorHandler("User Already Register"))
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