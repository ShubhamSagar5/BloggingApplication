import express from 'express'
import { getMyProfile, login, logout, register } from '../controller/userController.js'
import { isAuthenticated, isAuthorize } from '../middleware/auth.js'

const router = express.Router() 


router.post('/register',register)
router.post('/login',login)
router.get('/logout',logout)
router.get('/myProfile',isAuthenticated,getMyProfile)

export default router

