// Import necessary modules and middleware for the Express.js application
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
import defineRoute from "./routes/route.js";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from a .env file into process.env
dotenv.config();

// This code initializes an Express.js application, sets up middleware for JSON parsing and cookie handling,
// and defines routes for the application. It also includes error handling middleware to catch and respond to errors in a standardized way.
const app = express();
app.use(express.json());

// Static file middleware
app.use('/uploads', cors({
  origin: '*', // allow your Vite frontend
  credentials: true   // if you're using cookies or auth headers
}), express.static(path.join(__dirname, 'uploads')));


app.use(cors({
  origin: '*', // allow your Vite frontend
  credentials: true   // if you're using cookies or auth headers
}));


// Middleware to parse JSON bodies from incoming requests
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Route Initialization
app.use("/", defineRoute());

// Error Handling Middleware
// This middleware catches errors from the routes and sends a standardized error response.
app.use(errorHandler);

export default app;
