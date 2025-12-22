// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { handleFileUpload } from "./middlewares/fileUpload.js";
import userRoutes from "./routes/user.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import lostfounditemRoutes from "./routes/lostFound.routes.js";
import carpoolRoutes from "./routes/carpool.routes.js"; // Assuming carpoolRoutes is defined and imported
import sellbuysRoutes from "./routes/sellbuy.routes.js"; // Assuming sellbuysRoutes is defined and imported

// Load environment variables
dotenv.config();

// DB connection
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://one-bi-tstop.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl, Postman, or file uploads)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("CORS rejected for origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// App setup
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Add request logging middleware
app.use((req, res, next) => {
  // console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  // console.log('Content-Type:', req.headers['content-type']);
  // console.log('Content-Length:', req.headers['content-length']);
  next();
});

// Add file upload middleware for multipart form data
app.use(handleFileUpload);

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/lost-found", lostfounditemRoutes);
app.use("/api/v1/carpool", carpoolRoutes); // Assuming carpoolRoutes is defined and imported
app.use("/api/v1/sellbuys", sellbuysRoutes); // Assuming carpoolRoutes is defined and imported

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
