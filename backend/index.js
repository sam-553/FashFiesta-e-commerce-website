// backend/index.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cloudinaryModule from "cloudinary";
import path from "path";
import next from "next";
import { fileURLToPath } from "url";

// Local imports
import connectDb from "./config/connection.js";
import productrouter from "./routes/productRoutes.js";
import userrouter from "./routes/userRoutes.js";
import orderrouter from "./routes/orderRoutes.js";
import paymentrouter from "./routes/paymentRoutes.js";
import HandleErrorMiddleware from "./middlewear/error.js";

// Load environment variables
dotenv.config({ path: "backend/config/config.env" });

// Connect to MongoDB
connectDb();

// Configure Cloudinary
const cloudinary = cloudinaryModule.v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Resolve absolute path for Next.js dir
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Next.js
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: path.join(__dirname, "../frontend") });
const handle = nextApp.getRequestHandler();

// Start unified server
const port = process.env.PORT || 5000;

nextApp.prepare()
    .then(() => {
        console.log("✅ Next.js prepared successfully.");

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
            limits: { fileSize: 50 * 1024 * 1024 },
        }));

        // API Routes
        app.use("/api/product", productrouter);
        app.use("/api/user", userrouter);
        app.use("/api/order", orderrouter);
        app.use("/api/payment", paymentrouter);

        // Centralized error handler
        app.use(HandleErrorMiddleware);

        // Let Next.js handle all other unmatched routes
        app.use((req, res) => handle(req, res));

        // Start listening
        app.listen(port, "0.0.0.0", () => {
            console.log(`✅ Unified server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("❌ Next.js preparation error:", err);
    });