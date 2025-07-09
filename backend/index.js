import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cloudinaryModule from "cloudinary";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import Razorpay from "razorpay";
import validator from "validator";
import { fileURLToPath } from "url";
import path from "path";

// ✅ Local imports
import connectDb from "./config/connection.js";
import handleError from "./utils/handleError.js";
import productrouter from "./routes/productRoutes.js";
import userrouter from "./routes/userRoutes.js";
import orderrouter from "./routes/orderRoutes.js";
import paymentrouter from "./routes/paymentRoutes.js";

// ✅ __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Configure environment
if (process.env.NODE_ENV !== 'PRODUCTION') {
    dotenv.config({ path: "./backend/config/config.env" });
}

// ✅ Connect Database
connectDb();

// ✅ Configure Cloudinary
const cloudinary = cloudinaryModule.v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// ✅ Create Express app
const app = express();
const port = process.env.PORT || 5000;

// ✅ Middlewares
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use(cookieParser());

// ✅ Allow large JSON payloads
app.use(express.json({
    limit: "50mb",
    verify: function (req, res, buf) {
        req.rawBody = buf;
    }
}));

// ✅ Allow large URL-encoded payloads
app.use(express.urlencoded({
    extended: true,
    limit: "50mb",
}));

// ✅ Configure file uploads for large files
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
    useTempFiles: true,
}));

// ✅ Routes
app.use("/product", productrouter);
app.use("/user", userrouter);
app.use("/order", orderrouter);
app.use("/payment", paymentrouter);

// ✅ Error handler
app.use(handleError);

// ✅ Start Server
app.listen(port, () => {
    console.log(`✅ Server started on port ${port}`);
});

export default app;
