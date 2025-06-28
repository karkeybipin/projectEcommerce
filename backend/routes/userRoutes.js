// import express from "express";
// import {
//   sendOtp,
//   verifyOtpAndRegister,
//   loginUser,
//   adminLogin,
//   getUserProfile,
//   updateUserProfile,
//   sendForgotPasswordOtp,
//   verifyForgotPasswordOtp,
//   resetPassword,
//   changePassword
// } from "../controllers/userController.js";
// import authUser from "../middleware/auth.js";

// const userRouter = express.Router();

// // Registration routes
// userRouter.post("/send-otp", sendOtp); // Step 1: send OTP for registration
// userRouter.post("/verify-otp", verifyOtpAndRegister); // Step 2: verify OTP + register

// // Login routes
// userRouter.post("/login", loginUser);
// userRouter.post("/admin", adminLogin);

// // Forgot password routes
// userRouter.post("/forgot-password-otp", sendForgotPasswordOtp); // Send OTP for forgot password
// userRouter.post("/verify-forgot-otp", verifyForgotPasswordOtp); // Verify forgot password OTP
// userRouter.post("/reset-password", resetPassword); // Reset password after OTP verification

// // Profile routes (protected with authUser middleware)
// userRouter.post("/profile", authUser, getUserProfile); // Get user profile
// userRouter.post("/update-profile", authUser, updateUserProfile); // Update user profile (name, email only)
// userRouter.post("/change-password", authUser, changePassword); // Change password

// export default userRouter;

import express from "express";
import {
  testEmailConfig,
  sendOtp,
  verifyOtpAndRegister,
  loginUser,
  adminLogin,
  getUserProfile,
  updateUserProfile,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
  changePassword
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

// Test route (for debugging email configuration)
userRouter.get("/test-email", testEmailConfig); // GET request for easy testing

// Registration routes
userRouter.post("/send-otp", sendOtp); // Step 1: send OTP for registration
userRouter.post("/verify-otp", verifyOtpAndRegister); // Step 2: verify OTP + register

// Login routes
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

// Forgot password routes
userRouter.post("/forgot-password-otp", sendForgotPasswordOtp); // Send OTP for forgot password
userRouter.post("/verify-forgot-otp", verifyForgotPasswordOtp); // Verify forgot password OTP
userRouter.post("/reset-password", resetPassword); // Reset password after OTP verification

// Profile routes (protected with authUser middleware)
userRouter.post("/profile", authUser, getUserProfile); // Get user profile
userRouter.post("/update-profile", authUser, updateUserProfile); // Update user profile (name, email only)
userRouter.post("/change-password", authUser, changePassword); // Change password

export default userRouter;