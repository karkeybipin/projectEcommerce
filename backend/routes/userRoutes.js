// import express from "express";
// import { loginUser, registerUser, adminLogin } from "../controllers/userController.js";

// const userRouter = express.Router();

// userRouter.post("/register", registerUser);
// userRouter.post("/login", loginUser);
// userRouter.post("/admin", adminLogin);

// export default userRouter;

// ------------------------------------------------------------------

// import express from "express";
// import { loginUser, registerUser, adminLogin, sendWelcomeEmailRoute } from "../controllers/userController.js";

// const userRouter = express.Router();

// userRouter.post("/register", registerUser);
// userRouter.post("/login", loginUser);
// userRouter.post("/admin", adminLogin);
// userRouter.post("/send-welcome-email", sendWelcomeEmailRoute);

// export default userRouter;

// ------------------------------------------------------------------

import express from "express";
import {
  sendOtp,
  verifyOtpAndRegister,
  loginUser,
  adminLogin,
  getUserProfile,
  updateUserProfile
  
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";


const userRouter = express.Router();

userRouter.post("/send-otp", sendOtp); // Step 1: send OTP
userRouter.post("/verify-otp", verifyOtpAndRegister); // Step 2: verify OTP + register
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

// New profile routes (protected with authUser middleware)
userRouter.post("/profile", authUser, getUserProfile); // Get user profile
userRouter.post("/update-profile", authUser,updateUserProfile); // Update user profile


export default userRouter;

