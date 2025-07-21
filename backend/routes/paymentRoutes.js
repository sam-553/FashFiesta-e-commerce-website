// routes/paymentRoutes.js

import express from 'express';
import { processPayment, sendApiKey, paymentVerification } from '../controller/paymentController.js';
import { verifyUserAuth } from '../middlewear/userAuth.js';

const router = express.Router();

router.post('/processPayment', verifyUserAuth, processPayment);
router.get('/getKey', verifyUserAuth, sendApiKey);
router.post('/paymentVerification', paymentVerification);

export default router;
