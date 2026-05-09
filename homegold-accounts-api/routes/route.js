import { Router } from "express";

import { authenticate } from "../middleware/authenticate.js";
import authRoute from './auth.route.js';
import protectedRoute from './protected.route.js';

export default () => {
  const router = Router();

  // Register the authentication and admin routes
  router.use('/check', (req, res) => {
    res.json({ message: 'Test Server is Working ...' });
  });
  router.use("/auth", authRoute);
  router.use("/protected", authenticate, protectedRoute);


  // You can add more routes here as needed

  return router;
}