// routes/productRoutes.js
import express from 'express';
const router = express.Router();

import {
  createProduct,
  getAllProduct,
  updateproduct,
  deleteproduct,
  getproductdetails,
  getAdminProducts,
  createReviewForProduct,
  getProductReviews,
  deleteReview,
  getSingleProductReviews
} from '../controller/productController.js';

import { verifyUserAuth, rolebasedAccess } from '../middlewear/userAuth.js';


router.post('/addproduct',verifyUserAuth,rolebasedAccess('admin'), createProduct);
router.put('/createReviewForProduct', verifyUserAuth, createReviewForProduct);

router.get('/getProductReviews',verifyUserAuth,rolebasedAccess('admin'),getProductReviews)
router.delete('/deleteReview/:productId/:reviewId',verifyUserAuth,rolebasedAccess('admin'),deleteReview)
router.get('/getSingleProductReviews/:id',verifyUserAuth,rolebasedAccess('admin'), getSingleProductReviews);

router.get('/getAdminProducts',verifyUserAuth,rolebasedAccess('admin'), getAdminProducts);
router.get('/getAllProduct',getAllProduct);

router.put('/updateproduct/:id',verifyUserAuth,rolebasedAccess('admin'),updateproduct);
router.delete('/deleteproduct/:id',verifyUserAuth,rolebasedAccess('admin'),deleteproduct)
router.get('/getproductdetails/:id',getproductdetails)
export default router;