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

    const {title,intro,category,paraOneDescription,paraOneTitle,paraTwoDescription,paraTwoTitle,paraThreeDescription,paraThreeTitle,published} = req.body 
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
        published
        
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

export const  getSingleBlog = asyncHandler(async(req,res,next)=>{

    const {id} = req.params 

    const blog = await Blog.findById(id) 

    if(!blog){
        return next (new ErrorHandler("Blog Not Found",404))
    }

    return res.status(200).json({
        success:true,
        message:"Blog Found Successfully",
        blog
    })

})


export const getAllBlogs = asyncHandler(async(req,res,next)=>{

    const blogs = await Blog.find({published:true}) 

    if(!blogs){
        return next (new ErrorHandler("Blogs Not Found",404))
    }

    return res.status(200).json({
        success:true,
        message:"All Blogs Fetch Successfully",
        blogs
    })

})


export const deleteBlogs = asyncHandler(async(req,res,next)=>{

    const {id} = req.params 

    const blog = await Blog.findById(id) 

    if(!blog){
        return next (new ErrorHandler("Blog Not Found",400))
    }

    await blog.deleteOne() 

    return res.status(200).json({
        success:true,
        message:"Blogs Delete Successfully"
    })

})

export const getMyBlog = asyncHandler(async(req,res,next)=>{

    const createdById  = req.user?._id
    const myBlog = await Blog.find({createdBy:createdById})

    if(!myBlog){
        return next (new ErrorHandler("Blogs Are Not Found",404))
    }

    return res.status(200).json({
        success:true,
        message:"Blog Fetch Successfully",
        myBlog
    })
})


export const updateBlogs = asyncHandler(async(req,res,next)=>{

    const {id} = req.params 

    let blog = await Blog.findById(id)

    if(!blog){
        return next (new ErrorHandler("Blog Not Found",400))
    }

    const {title,intro,paraOneDescription,paraOneTitle,paraTwoDescription,paraTwoTitle,paraThreeDescription,paraThreeTitle,category,published} = req.body

    const newData = {
        title,
        intro,
        paraOneDescription,
        paraOneTitle,
        paraTwoDescription,
        paraTwoTitle,
        paraThreeDescription,
        paraThreeTitle,
        category,
        published
    }


        

    if(req.files){

           const {mainImage,paraOneImage,paraTwoImage,paraThreeImage} = req.files 

            const allowedTypes = ["image/png","image/jpeg","image/webp"]


        if((mainImage && !allowedTypes.includes(mainImage.mimetype)) || (paraOneImage && !allowedTypes.includes(paraOneImage.mimetype)) || (paraTwoImage && !allowedTypes.includes(paraTwoImage.mimetype)) || (paraThreeImage && !allowedTypes.includes(paraThreeImage.mimetype))){
            return next (new ErrorHandler("Invalid file format. Only PNG, JPG and WEBp formats are allowed.",
          400))
        }
    

         if(req.files && mainImage){
            const blogMainImageId = blog.mainImage.public_id 
            await cloudinary.uploader.destroy(blogMainImageId) 

            const newBlogMainImage = await cloudinary.uploader.upload(mainImage.tempFilePath) 

            newData.mainImage = {
                public_id:newBlogMainImage.public_id,
                url:newBlogMainImage.secure_url
            }

         }

         if(req.files && paraOneImage){
            const blogParaOneImageId = blog.paraOneImage.public_id 
            await cloudinary.uploader.destroy(blogParaOneImageId) 

            const newBlogParaOneImage = await cloudinary.uploader.upload(paraOneImage.tempFilePath) 

            newData.paraOneImage = {
                public_id:newBlogParaOneImage.public_id,
                url:newBlogParaOneImage.secure_url
            }

         }

         if(req.files && paraTwoImage){
            const blogParaTwoImageId = blog.paraTwoImage.public_id 
            await cloudinary.uploader.destroy(blogParaTwoImageId) 

            const newBlogParaTwoImage = await cloudinary.uploader.upload(paraTwoImage.tempFilePath) 

            newData.paraTwoImage ={
                public_id:newBlogParaTwoImage.public_id, 
                url:newBlogParaTwoImage.secure_url
            }
         }

         if(req.files && paraThreeImage){
            const blogParaThreeImageId = blog.paraThreeImage.public_id 
            await cloudinary.uploader.destroy 

            const newBlogParaThreeImage = await cloudinary.uploader.upload(paraThreeImage.tempFilePath)

            newData.paraThreeImage = {
                public_id:newBlogParaThreeImage.public_id ,
                url:newBlogParaThreeImage.secure_url
            }
         }
    
    }

    blog = await Blog.findByIdAndUpdate(id,newData,{
        new:true,
        runValidators:true,
        useFindAndModify: false,
    })

    return res.status(200).json({
        success:true,
        message:"Blog Update Successfully",
        blog
    })
   

})