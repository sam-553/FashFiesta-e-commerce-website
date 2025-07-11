import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cloudinaryModule from "cloudinary";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";
import path from "path";

// Local imports
import connectDb from "./config/connection.js";
import productrouter from "./routes/productRoutes.js";
import userrouter from "./routes/userRoutes.js";
import orderrouter from "./routes/orderRoutes.js";
import paymentrouter from "./routes/paymentRoutes.js";
import HandleErrorMiddleware from "./middlewear/error.js";

// __dirname setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure environment
dotenv.config({
    path: process.env.NODE_ENV !== "PRODUCTION" ? "config/config.env" : undefined,
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

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors({
    origin: "http://localhost:3000",  // Frontend URL
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(fileUpload({
    useTempFiles: true,
    limits: { fileSize: 50 * 1024 * 1024 },
}));

// ✅ Health check route to avoid 404 on "/"
app.get("/", (req, res) => {
    res.send("✅ Backend server is running on http://localhost:" + port);
});

// API Routes
app.use("/product", productrouter);
app.use("/user", userrouter);
app.use("/order", orderrouter);
app.use("/payment", paymentrouter);

// Serving frontend in production
if (process.env.NODE_ENV === "PRODUCTION") {
    const frontendPath = path.join(__dirname, "../frontend/out");
    app.use(express.static(frontendPath));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(frontendPath, "index.html"));
    });
}

// Error Middleware
app.use(HandleErrorMiddleware);

// Start Server
app.listen(port, () => {
    console.log(` Backend server running on port ${port}`);
});

export default app;
