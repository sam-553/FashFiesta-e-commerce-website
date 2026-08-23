// backend/index.js

import express from "express";
import dotenv from "dotenv";
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

// Load env
dotenv.config({ path: "./backend/config/config.env" });

// DB connect
connectDb();

// Cloudinary config
const cloudinary = cloudinaryModule.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Path fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Next setup
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: path.join(__dirname, "../frontend") });
const handle = nextApp.getRequestHandler();

const port = process.env.PORT || 5000;

nextApp.prepare().then(() => {
  const app = express();

  // 🔹 Middlewares
  app.use(cookieParser());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(
    fileUpload({
      useTempFiles: true,
      limits: { fileSize: 50 * 1024 * 1024 },
    })
  );

  // 🔹 API Routes
  app.use("/api/product", productrouter);
  app.use("/api/user", userrouter);
  app.use("/api/order", orderrouter);
  app.use("/api/payment", paymentrouter);

  // 🔹 Error Middleware
  app.use(HandleErrorMiddleware);

  // 🔹 FIXED Next.js handler (IMPORTANT)
  app.use((req, res) => {
    return handle(req, res);
  });

  // 🔹 Server start
  app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
  });
});