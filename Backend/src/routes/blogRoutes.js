import express from 'express'
import { isAuthenticated,isAuthorize } from '../middleware/auth.js'
import { blogPost, deleteBlogs, getAllBlogs, getMyBlog, getSingleBlog, updateBlogs } from '../controller/blogController.js'

const router = express.Router() 

router.post('/createBlog',isAuthenticated,isAuthorize("Author"),blogPost)

router.get('/getSingleBlog/:id',isAuthenticated,isAuthorize("Author"),getSingleBlog)

router.get('/getAllBlog',getAllBlogs)

router.delete('/deleteBlog/:id',isAuthenticated,isAuthorize("Author"),deleteBlogs)

router.get('/getMyBlog',isAuthenticated,isAuthorize("Author"),getMyBlog)

router.put('/updateBlog/:id',isAuthenticated,isAuthorize("Author"),updateBlogs)

export default router