

export const sendToken = async (user,statusCode,message,res) => {

    const token = user.generateToken()

    const options = {
        expire:new Date(Date.now() + process.env.COOKIEEXPIRE * 24 * 60 * 60 * 100),
        httpOnly:true
    }

    

    return res.status(statusCode).cookie("token",token,options).json({
        success:true,
        message,
        token,
        user
    })

}

