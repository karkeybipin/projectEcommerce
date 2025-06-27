import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";

// In-memory OTP store (replace with DB/Redis for production)
const otpStore = new Map();
const forgotPasswordOtpStore = new Map();

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Email transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Account Created Successfully!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Welcome to Our Platform!</h2>
          <p>Hi ${userName},</p>
          <p>Congratulations! Your account has been created successfully.</p>
          <p>Enjoy our platform!</p>
          <hr>
          <p>If you have any questions, contact support.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email:", error.message);
  }
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Step 1: Send OTP for registration
const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email || !validator.isEmail(email))
    return res.status(400).json({ success: false, message: "Valid email required" });

  // Check if user already exists
  const exists = await userModel.findOne({ email }).lean().exec();
  if (exists) return res.json({ success: false, message: "User already exists" });

  const otp = generateOTP();

  // Store OTP with 5 min expiry
  otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Account Verification</h2>
          <p>Your OTP for account verification is:</p>
          <div style="text-align: center; font-size: 24px; font-weight: bold; color: #007bff; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
      `,
    });
    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.json({ success: false, message: "Failed to send OTP" });
  }
};

// Step 2: Verify OTP & create user
const verifyOtpAndRegister = async (req, res) => {
  const { name, email, password, otp } = req.body;
  if (!name || !email || !password || !otp)
    return res.status(400).json({ success: false, message: "All fields required" });

  if (!validator.isEmail(email))
    return res.status(400).json({ success: false, message: "Invalid email" });

  if (password.length < 8)
    return res.status(400).json({ success: false, message: "Password too short" });

  const record = otpStore.get(email);
  if (!record) return res.json({ success: false, message: "OTP expired or not found" });
  if (record.expiresAt < Date.now()) {
    otpStore.delete(email);
    return res.json({ success: false, message: "OTP expired" });
  }
  if (record.otp !== otp) return res.json({ success: false, message: "Invalid OTP" });

  // OTP valid, delete it
  otpStore.delete(email);

  // Check again if user exists (race condition safety)
  const exists = await userModel.findOne({ email }).lean().exec();
  if (exists) return res.json({ success: false, message: "User already exists" });

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    await sendWelcomeEmail(email, name);

    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.error("Error creating user:", error);
    res.json({ success: false, message: "Registration failed" });
  }
};

// Send OTP for forgot password
const sendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;
  
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: "Valid email required" });
  }

  try {
    // Check if user exists
    const user = await userModel.findOne({ email }).lean().exec();
    if (!user) {
      return res.json({ success: false, message: "No account found with this email" });
    }

    const otp = generateOTP();
    
    // Store OTP with 10 min expiry for forgot password
    forgotPasswordOtpStore.set(email, { 
      otp, 
      expiresAt: Date.now() + 10 * 60 * 1000,
      verified: false 
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p>You have requested to reset your password. Your OTP is:</p>
          <div style="text-align: center; font-size: 24px; font-weight: bold; color: #dc3545; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "Password reset OTP sent to your email" });
  } catch (error) {
    console.error("Error sending forgot password OTP:", error);
    res.json({ success: false, message: "Failed to send OTP" });
  }
};

// Verify forgot password OTP
const verifyForgotPasswordOtp = async (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP required" });
  }

  const record = forgotPasswordOtpStore.get(email);
  
  if (!record) {
    return res.json({ success: false, message: "OTP expired or not found" });
  }
  
  if (record.expiresAt < Date.now()) {
    forgotPasswordOtpStore.delete(email);
    return res.json({ success: false, message: "OTP expired" });
  }
  
  if (record.otp !== otp) {
    return res.json({ success: false, message: "Invalid OTP" });
  }

  // Mark OTP as verified but don't delete yet
  record.verified = true;
  forgotPasswordOtpStore.set(email, record);

  res.json({ success: true, message: "OTP verified successfully" });
};

// Reset password after OTP verification
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  
  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: "Email and new password required" });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
  }

  const record = forgotPasswordOtpStore.get(email);
  
  if (!record || !record.verified) {
    return res.json({ success: false, message: "OTP not verified or expired" });
  }

  if (record.expiresAt < Date.now()) {
    forgotPasswordOtpStore.delete(email);
    return res.json({ success: false, message: "OTP expired" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    // Delete the OTP record after successful password reset
    forgotPasswordOtpStore.delete(email);

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.json({ success: false, message: "Failed to reset password" });
  }
};

// Existing routes for login and admin login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await userModel.findById(userId).select('-password');
    
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ 
      success: true, 
      user: {
        name: user.name,
        email: user.email,
        cartData: user.cartData
      }
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.json({ success: false, message: "Failed to fetch profile" });
  }
};

// Update user profile (without password)
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const { name, email } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        message: "Name and email are required" 
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid email format" 
      });
    }

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const emailExists = await userModel.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      
      if (emailExists) {
        return res.json({ 
          success: false, 
          message: "Email is already registered with another account" 
        });
      }
    }

    // Prepare update data (excluding password)
    const updateData = {
      name: name.trim(),
      email: email.toLowerCase().trim()
    };

    // Update user
    const updatedUser = await userModel.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.json({ success: false, message: "Failed to update profile" });
    }

    res.json({ 
      success: true, 
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        cartData: updatedUser.cartData
      }
    });

  } catch (error) {
    console.error("Error updating user profile:", error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.json({ 
        success: false, 
        message: messages.join(', ') 
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.json({ 
        success: false, 
        message: "Email is already registered" 
      });
    }

    res.json({ success: false, message: "Failed to update profile" });
  }
};

// Change password (separate function)
const changePassword = async (req, res) => {
  try {
    const { userId } = req.body;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "All password fields are required" 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "New password and confirm password do not match" 
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: "New password must be at least 8 characters long" 
      });
    }

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.json({ success: false, message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await userModel.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.json({ 
      success: true, 
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Error changing password:", error);
    res.json({ success: false, message: "Failed to change password" });
  }
};

export {
  sendOtp,
  verifyOtpAndRegister,
  loginUser,
  adminLogin,
  sendWelcomeEmail,
  getUserProfile,
  updateUserProfile,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
  changePassword
};