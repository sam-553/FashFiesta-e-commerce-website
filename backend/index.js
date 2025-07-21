// backend/index.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cloudinaryModule from "cloudinary";



// Local imports
import connectDb from "./config/connection.js";
import productrouter from "./routes/productRoutes.js";
import userrouter from "./routes/userRoutes.js";
import orderrouter from "./routes/orderRoutes.js";
import paymentrouter from "./routes/paymentRoutes.js";
import HandleErrorMiddleware from "./middlewear/error.js";

// Load environment variables
dotenv.config({
    path: "config/config.env"
});

// Connect to MongoDB
connectDb();

// Configure Cloudinary
const cloudinary = cloudinaryModule.v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Initialize Next.js


// Start unified server
const port = process.env.PORT || 5000;


    const app = express();

    // Core middlewares
    app.use(cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    }));
    app.use(cookieParser());
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    app.use(fileUpload({
        useTempFiles: true,
        limits: { fileSize: 50 * 1024 * 1024 }
    }));

    // API Routes
    app.use("/api/product", productrouter);
    app.use("/api/user", userrouter);
    app.use("/api/order", orderrouter);
    app.use("/api/payment", paymentrouter);

    // Centralized error handler
    app.use(HandleErrorMiddleware);

    // Let Next.js handle all other routes
    

    // Start listening
    app.listen(port, "0.0.0.0", () => {
        console.log(`✅ Unified server running on http://localhost:${port}`);
    });
