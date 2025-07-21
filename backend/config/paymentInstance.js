import Razorpay from "razorpay";
import dotenv from "dotenv";

// Always load .env for now
if (process.env.NODE_ENV != 'PRODUCTION') {
    dotenv.config({ path: "config/config.env" });
}

// Debug to ensure keys are loaded




const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

export default instance;
