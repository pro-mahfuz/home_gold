
import { hash } from "bcryptjs";
import { User } from "../../models/model.js";
import { sendResetEmail } from "../../utils/mailer.js";
import jwt from "jsonwebtoken";


// 1. Request Reset
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign(
      { id: user.id, email: user.email, purpose: "password_reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // TODO: Send token via email
    // console.log(`Password reset link: http://localhost:3000/reset-password/${token}`);
    
    // In a real application, you would send this link via email to the user
    // For example, using nodemailer or any email service provider
    // sendEmail(user.email, `Reset your password`, `Click here to reset: http://localhost:3000/reset-password/${token}`);
    await sendResetEmail(email, token)
    .then(() => console.log("Email sent!"))
    .catch(console.error);

    res.json({ message: "Password reset email sent (see email for link)" });
  } catch (err) {
    next(err);
  }
};

// 2. Handle Reset
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Validate input
    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Check token purpose
    if (decoded.purpose !== "password_reset") {
      return res.status(400).json({ message: "Invalid token purpose" });
    }

    console.log("decoded- ", decoded.id);

    // Find user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await hash(password, 10);

    // Save user
    user.password = hashedPassword;
    await user.save();

    console.log(`Password reset for user ID: ${decoded.id}`);
    
    // Send response
    return res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
