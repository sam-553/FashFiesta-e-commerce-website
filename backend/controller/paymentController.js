
import instance from '../config/paymentInstance.js';
import handleasyncError from '../middlewear/handleasyncError.js';
import dotenv from 'dotenv';
if(process.env.NODE_ENV!='PRODUCTION'){
dotenv.config({ path: "config/config.env" });
}
import crypto from 'crypto';


const processPayment=handleasyncError(async (req,res) => {
    const options={
        amount:Number(req.body.amount)*100,
        currency:'INR',
    }
   const order= await instance.orders.create(options);
   res.status(200).json({
    success:true,
    
    order
   })
})
const sendApiKey=handleasyncError(async (req,res) => {
   {
    res.status(200).json({
        Key:process.env.RAZORPAY_API_KEY
    })
   }
})
const paymentVerification = handleasyncError(async (req, res) => {
    console.log('Request Body:', req.body);

   const { razorpay_signature, razorpay_payment_id, razorpay_order_id } = req.body || {};
 // adjust if nested

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
        .update(body.toString())
        .digest('hex');

    console.log('Expected Signature:', expectedSignature);
    console.log('Received Signature:', razorpay_signature);

    const isAuthentic = expectedSignature === razorpay_signature;

    if(isAuthentic){
        res.status(200).json({
        success: true,
        message:"payment verified successfully",
        isAuthentic,
        reference: razorpay_payment_id
    });
    }else{
        res.status(200).json({
        success: true,
        message:"payment not  verified successfully",
        });
    }
    
});


export { processPayment, sendApiKey, paymentVerification };
