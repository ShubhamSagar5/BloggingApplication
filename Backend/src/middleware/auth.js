import jwt from 'jsonwebtoken'
import { User } from '../models/userSchema.js'

// Authentication

export const isAuthenticated  = async (req,res,next) =>  {
    try {
        
        const token = req.cookies.token 

        if(!token){
            return res.status(404).json({
                success:false,
                message:"User Not Authenticate please Login !"
            })
        }

        const decode = jwt.verify(token,process.env.JWT_SECRETKEY)

        req.user = await User.findById(decode.id) 

        next()

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
} 

// Authorization 

export const isAuthorize = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return res.status(400).json({
                success:false,
                message:`User with this role(${req.user.role}) not allowed to access this resource`
            })
        }
        next()
    }
}
