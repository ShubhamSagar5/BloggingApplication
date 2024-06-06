import { asyncHandler } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import { Blog } from "../models/blogSchema.js";
import cloudinary from 'cloudinary'


export const blogPost = asyncHandler(async(req,res,next)=>{

    if(!req.files || Object.keys(req.files).length === 0){
        return next (new ErrorHandler("Blog Main Image is Required",400))
    }

    const {mainImage,paraOneImage,paraTwoImage,paraThreeImage} = req.files

    const allowedTypes = ["image/png","image/jpeg","image/webp"] 

    if(!mainImage){
        return next (new ErrorHandler("Blog Main Image Required",400))
    }

    if(!allowedTypes.includes(mainImage.mimetype) || (paraOneImage && !allowedTypes.includes(paraOneImage.mimetype)) || (paraTwoImage && !allowedTypes.includes(paraTwoImage.mimetype)) || (paraThreeImage && !allowedTypes.includes(paraThreeImage.mimetype))){
        return next (new ErrorHandler("File Type Does Not Support.It Will only Support PNG,JPEG,WEBP Types",400))
    }

    const {title,intro,category,paraOneDescription,paraOneTitle,paraTwoDescription,paraTwoTitle,paraThreeDescription,paraThreeTitle} = req.body 
    if(!title,!intro,!category){
        return next (new ErrorHandler("Title ,Introduction, Category is Required"))
    }

    const createdBy = req.user._id;
    const authorName = req.user.name
    const authorAvatar = req.user.avatar.url

    

    const uploadImagePromise = [
        mainImage ? cloudinary.uploader.upload(mainImage.tempFilePath) : Promise.resolve(null),
        paraOneImage ? cloudinary.uploader.upload(paraOneImage.tempFilePath) : Promise.resolve(null),
        paraTwoImage ? cloudinary.uploader.upload(paraTwoImage.tempFilePath) : Promise.resolve(null),
        paraThreeImage ? cloudinary.uploader.upload(paraThreeImage.tempFilePath) : Promise.resolve(null),

    ]

    const [mainImageRes,paraOneImgRes,paraTwoImageRes,paraThreeImgRes] = await Promise.all(uploadImagePromise)

    if(!mainImageRes || mainImageRes.error || (paraOneImage && (!paraOneImgRes || paraOneImgRes.error)) || (paraTwoImage && (!paraTwoImageRes || paraTwoImageRes.error)) || (paraThreeImage && (!paraThreeImgRes || paraThreeImgRes.error))){
            return next (new ErrorHandler( new ErrorHandler("Error occured while uploading one or more images!", 500)))
    }

    const blogData = {
        title,
        intro,
        paraOneTitle,
        paraOneDescription,
        paraTwoTitle,
        paraTwoDescription,
        paraThreeTitle,
        paraThreeDescription,
        category,
        authorName,
        authorAvatar,
        createdBy,
        mainImage:{
            public_id:mainImageRes.public_id,
            url:mainImageRes.secure_url
        },
        
    }

    if(paraOneImgRes){
        blogData.paraOneImage = {
            public_id:paraOneImgRes.public_id,
            url:paraOneImgRes.secure_url
        }
    }

    if(paraTwoImageRes){
        blogData.paraTwoImage = {
            public_id:paraTwoImageRes.public_id,
            url:paraTwoImageRes.secure_url
        }
    }

    
    if(paraThreeImgRes){
        blogData.paraThreeImage = {
            public_id:paraThreeImgRes.public_id,
            url:paraThreeImgRes.secure_url
        }
    }

    const blog = await Blog.create(blogData) 

    return res.status(200).json({
        success:true,
        message:"Blog Upload Successfully",
        blog
    })


})

