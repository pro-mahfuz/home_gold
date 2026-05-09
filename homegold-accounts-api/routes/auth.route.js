import { Router } from "express";

import { validate } from "../middleware/validate.js";
import { registerSchema } from "../modules/auth/register.validator.js";
import { loginSchema } from "../modules/auth/login.validator.js";
import * as AuthController from "../modules/auth/auth.controller.js";
import * as PasswordController from "../modules/auth/password.controller.js";

const router = Router();

// Define routes for user authentication and management
// Route to register a new user, with validation middleware applied
router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/isTokenExpired", AuthController.isAccessTokenExpired);
router.post("/refresh", AuthController.refreshToken);

router.post("/forgot-password", PasswordController.forgotPassword);
router.post("/reset-password", PasswordController.resetPassword);

export default router;