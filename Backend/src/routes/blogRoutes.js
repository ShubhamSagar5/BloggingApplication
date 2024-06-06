import express from 'express'
import { isAuthenticated,isAuthorize } from '../middleware/auth.js'
import { blogPost } from '../controller/blogController.js'

const router = express.Router() 

router.post('/createBlog',isAuthenticated,isAuthorize("Author"),blogPost)

export default router