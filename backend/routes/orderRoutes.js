import express from 'express';
const router = express.Router();

import { verifyUserAuth, rolebasedAccess } from '../middlewear/userAuth.js';
import {
  createNewOrder,
  getSingleOrder,
  allMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} from '../controller/orderController.js';


router.post('/createOrder',verifyUserAuth,createNewOrder)
router.get('/getSingleOrder/:id',verifyUserAuth,getSingleOrder)
router.get('/allMyOrders',verifyUserAuth,allMyOrders)
router.get('/getAllOrders',verifyUserAuth,rolebasedAccess('admin'),getAllOrders)
router.put('/updateOrderStatus/:id',verifyUserAuth,rolebasedAccess('admin'),updateOrderStatus)
router.delete('/deleteOrder/:id',verifyUserAuth,rolebasedAccess('admin'),deleteOrder)


export default router;