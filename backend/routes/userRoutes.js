
import express from 'express';

import {
  userRegister,
  loginUser,
  logOut,
  requestresetpassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getUsersList,
  getSingleUser,
  updateUserRole,
  deleteUser
} from '../controller/userController.js';

import { verifyUserAuth, rolebasedAccess } from '../middlewear/userAuth.js';

const router=express.Router();
router.post('/registerUser',userRegister)
router.post('/loginUser',loginUser)
router.post('/logout',logOut)
router.post('/requestresetpassword',requestresetpassword)
router.put('/resetpassword/:token',resetPassword)
router.get('/getuserDetails',verifyUserAuth,getUserDetails)
router.put('/updatePassword',verifyUserAuth,updatePassword)
router.put('/updateProfile',verifyUserAuth,updateProfile)
router.get('/getUsersList',verifyUserAuth,rolebasedAccess('admin'),getUsersList)
router.get('/getSingleUser/:id',verifyUserAuth,rolebasedAccess('admin'),getSingleUser)
router.put('/updateUserRole/:id',verifyUserAuth,rolebasedAccess('admin'),updateUserRole)
router.delete('/deleteUser/:id',verifyUserAuth,rolebasedAccess('admin'),deleteUser)


export default router;