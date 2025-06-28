// import validator from "validator";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import userModel from "../models/userModel.js";
// import nodemailer from "nodemailer";

// // In-memory OTP store (replace with DB/Redis for production)
// const otpStore = new Map();
// const forgotPasswordOtpStore = new Map();

// const createToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET);
// };

// // Email transporter (Gmail example)
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// const sendWelcomeEmail = async (userEmail, userName) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: userEmail,
//       subject: "Account Created Successfully!",
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//           <h2 style="color: #333; text-align: center;">Welcome to Our Platform!</h2>
//           <p>Hi ${userName},</p>
//           <p>Congratulations! Your account has been created successfully.</p>
//           <p>Enjoy our platform!</p>
//           <hr>
//           <p>If you have any questions, contact support.</p>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error("Error sending welcome email:", error.message);
//   }
// };

// // Generate 6-digit OTP
// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Step 1: Send OTP for registration
// const sendOtp = async (req, res) => {
//   const { email } = req.body;
//   if (!email || !validator.isEmail(email))
//     return res.status(400).json({ success: false, message: "Valid email required" });

//   // Check if user already exists
//   const exists = await userModel.findOne({ email }).lean().exec();
//   if (exists) return res.json({ success: false, message: "User already exists" });

//   const otp = generateOTP();

//   // Store OTP with 5 min expiry
//   otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Your Verification OTP",
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//           <h2 style="color: #333; text-align: center;">Account Verification</h2>
//           <p>Your OTP for account verification is:</p>
//           <div style="text-align: center; font-size: 24px; font-weight: bold; color: #007bff; margin: 20px 0;">
//             ${otp}
//           </div>
//           <p>This OTP will expire in 5 minutes.</p>
//           <p>If you didn't request this verification, please ignore this email.</p>
//         </div>
//       `,
//     });
//     res.json({ success: true, message: "OTP sent to your email" });
//   } catch (error) {
//     console.error("Error sending OTP email:", error);
//     res.json({ success: false, message: "Failed to send OTP" });
//   }
// };

// // Step 2: Verify OTP & create user
// const verifyOtpAndRegister = async (req, res) => {
//   const { name, email, password, otp } = req.body;
//   if (!name || !email || !password || !otp)
//     return res.status(400).json({ success: false, message: "All fields required" });

//   if (!validator.isEmail(email))
//     return res.status(400).json({ success: false, message: "Invalid email" });

//   if (password.length < 8)
//     return res.status(400).json({ success: false, message: "Password too short" });

//   const record = otpStore.get(email);
//   if (!record) return res.json({ success: false, message: "OTP expired or not found" });
//   if (record.expiresAt < Date.now()) {
//     otpStore.delete(email);
//     return res.json({ success: false, message: "OTP expired" });
//   }
//   if (record.otp !== otp) return res.json({ success: false, message: "Invalid OTP" });

//   // OTP valid, delete it
//   otpStore.delete(email);

//   // Check again if user exists (race condition safety)
//   const exists = await userModel.findOne({ email }).lean().exec();
//   if (exists) return res.json({ success: false, message: "User already exists" });

//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new userModel({ name, email, password: hashedPassword });
//     const user = await newUser.save();

//     await sendWelcomeEmail(email, name);

//     const token = createToken(user._id);

//     res.json({ success: true, token });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.json({ success: false, message: "Registration failed" });
//   }
// };

// // Send OTP for forgot password
// const sendForgotPasswordOtp = async (req, res) => {
//   const { email } = req.body;
  
//   if (!email || !validator.isEmail(email)) {
//     return res.status(400).json({ success: false, message: "Valid email required" });
//   }

//   try {
//     // Check if user exists
//     const user = await userModel.findOne({ email }).lean().exec();
//     if (!user) {
//       return res.json({ success: false, message: "No account found with this email" });
//     }

//     const otp = generateOTP();
    
//     // Store OTP with 10 min expiry for forgot password
//     forgotPasswordOtpStore.set(email, { 
//       otp, 
//       expiresAt: Date.now() + 10 * 60 * 1000,
//       verified: false 
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Password Reset OTP",
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//           <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
//           <p>You have requested to reset your password. Your OTP is:</p>
//           <div style="text-align: center; font-size: 24px; font-weight: bold; color: #dc3545; margin: 20px 0;">
//             ${otp}
//           </div>
//           <p>This OTP will expire in 10 minutes.</p>
//           <p>If you didn't request this password reset, please ignore this email.</p>
//         </div>
//       `,
//     });

//     res.json({ success: true, message: "Password reset OTP sent to your email" });
//   } catch (error) {
//     console.error("Error sending forgot password OTP:", error);
//     res.json({ success: false, message: "Failed to send OTP" });
//   }
// };

// // Verify forgot password OTP
// const verifyForgotPasswordOtp = async (req, res) => {
//   const { email, otp } = req.body;
  
//   if (!email || !otp) {
//     return res.status(400).json({ success: false, message: "Email and OTP required" });
//   }

//   const record = forgotPasswordOtpStore.get(email);
  
//   if (!record) {
//     return res.json({ success: false, message: "OTP expired or not found" });
//   }
  
//   if (record.expiresAt < Date.now()) {
//     forgotPasswordOtpStore.delete(email);
//     return res.json({ success: false, message: "OTP expired" });
//   }
  
//   if (record.otp !== otp) {
//     return res.json({ success: false, message: "Invalid OTP" });
//   }

//   // Mark OTP as verified but don't delete yet
//   record.verified = true;
//   forgotPasswordOtpStore.set(email, record);

//   res.json({ success: true, message: "OTP verified successfully" });
// };

// // Reset password after OTP verification
// const resetPassword = async (req, res) => {
//   const { email, newPassword } = req.body;
  
//   if (!email || !newPassword) {
//     return res.status(400).json({ success: false, message: "Email and new password required" });
//   }

//   if (newPassword.length < 8) {
//     return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
//   }

//   const record = forgotPasswordOtpStore.get(email);
  
//   if (!record || !record.verified) {
//     return res.json({ success: false, message: "OTP not verified or expired" });
//   }

//   if (record.expiresAt < Date.now()) {
//     forgotPasswordOtpStore.delete(email);
//     return res.json({ success: false, message: "OTP expired" });
//   }

//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     await userModel.findOneAndUpdate(
//       { email },
//       { password: hashedPassword },
//       { new: true }
//     );

//     // Delete the OTP record after successful password reset
//     forgotPasswordOtpStore.delete(email);

//     res.json({ success: true, message: "Password reset successfully" });
//   } catch (error) {
//     console.error("Error resetting password:", error);
//     res.json({ success: false, message: "Failed to reset password" });
//   }
// };

// // Existing routes for login and admin login
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await userModel.findOne({ email });
//     if (!user) return res.json({ success: false, message: "User does not exist" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (isMatch) {
//       const token = createToken(user._id);
//       return res.json({ success: true, token });
//     } else {
//       return res.json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
//       const token = jwt.sign(email + password, process.env.JWT_SECRET);
//       res.json({ success: true, token });
//     } else {
//       res.json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // Get user profile
// const getUserProfile = async (req, res) => {
//   try {
//     const { userId } = req.body;
    
//     const user = await userModel.findById(userId).select('-password');
    
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     res.json({ 
//       success: true, 
//       user: {
//         name: user.name,
//         email: user.email,
//         cartData: user.cartData
//       }
//     });
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     res.json({ success: false, message: "Failed to fetch profile" });
//   }
// };

// // Update user profile (without password)
// const updateUserProfile = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const { name, email } = req.body;

//     // Validation
//     if (!name || !email) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Name and email are required" 
//       });
//     }

//     if (!validator.isEmail(email)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Invalid email format" 
//       });
//     }

//     // Check if user exists
//     const user = await userModel.findById(userId);
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     // Check if email is already taken by another user
//     if (email !== user.email) {
//       const emailExists = await userModel.findOne({ 
//         email, 
//         _id: { $ne: userId } 
//       });
      
//       if (emailExists) {
//         return res.json({ 
//           success: false, 
//           message: "Email is already registered with another account" 
//         });
//       }
//     }

//     // Prepare update data (excluding password)
//     const updateData = {
//       name: name.trim(),
//       email: email.toLowerCase().trim()
//     };

//     // Update user
//     const updatedUser = await userModel.findByIdAndUpdate(
//       userId, 
//       updateData, 
//       { new: true, runValidators: true }
//     ).select('-password');

//     if (!updatedUser) {
//       return res.json({ success: false, message: "Failed to update profile" });
//     }

//     res.json({ 
//       success: true, 
//       message: "Profile updated successfully",
//       user: {
//         name: updatedUser.name,
//         email: updatedUser.email,
//         cartData: updatedUser.cartData
//       }
//     });

//   } catch (error) {
//     console.error("Error updating user profile:", error);
    
//     // Handle MongoDB validation errors
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(err => err.message);
//       return res.json({ 
//         success: false, 
//         message: messages.join(', ') 
//       });
//     }

//     // Handle duplicate key error
//     if (error.code === 11000) {
//       return res.json({ 
//         success: false, 
//         message: "Email is already registered" 
//       });
//     }

//     res.json({ success: false, message: "Failed to update profile" });
//   }
// };

// // Change password (separate function)
// const changePassword = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const { currentPassword, newPassword, confirmPassword } = req.body;

//     // Validation
//     if (!currentPassword || !newPassword || !confirmPassword) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "All password fields are required" 
//       });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "New password and confirm password do not match" 
//       });
//     }

//     if (newPassword.length < 8) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "New password must be at least 8 characters long" 
//       });
//     }

//     // Check if user exists
//     const user = await userModel.findById(userId);
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     // Verify current password
//     const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
//     if (!isCurrentPasswordValid) {
//       return res.json({ success: false, message: "Current password is incorrect" });
//     }

//     // Hash new password
//     const salt = await bcrypt.genSalt(10);
//     const hashedNewPassword = await bcrypt.hash(newPassword, salt);

//     // Update password
//     await userModel.findByIdAndUpdate(userId, { password: hashedNewPassword });

//     res.json({ 
//       success: true, 
//       message: "Password changed successfully"
//     });

//   } catch (error) {
//     console.error("Error changing password:", error);
//     res.json({ success: false, message: "Failed to change password" });
//   }
// };

// export {
//   sendOtp,
//   verifyOtpAndRegister,
//   loginUser,
//   adminLogin,
//   sendWelcomeEmail,
//   getUserProfile,
//   updateUserProfile,
//   sendForgotPasswordOtp,
//   verifyForgotPasswordOtp,
//   resetPassword,
//   changePassword
// };

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

// Updated Email transporter with better configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587, // Gmail's SMTP port (NOT your backend port)
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  debug: true, // Enable debug logs
  logger: true // Log information in console
});

// Test email configuration function
const testEmailConfig = async (req, res) => {
  try {
    console.log('=== Email Configuration Test ===');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set ✓' : 'Missing ✗');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set ✓' : 'Missing ✗');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set ✓' : 'Missing ✗');
    
    // Test SMTP connection
    console.log('Testing SMTP connection...');
    await transporter.verify();
    console.log('✓ SMTP connection successful');
    
    // Send test email to yourself
    console.log('Sending test email...');
    const testResult = await transporter.sendMail({
      from: `"YungFlame Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'Test Email from Vercel Backend',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px;">
          <h2 style="color: #4CAF50;">✓ Email Configuration Working!</h2>
          <p>If you receive this email, your backend email configuration is working perfectly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Server:</strong> Vercel Backend</p>
        </div>
      `
    });
    
    console.log('✓ Test email sent successfully:', testResult.messageId);
    res.json({ 
      success: true, 
      message: 'Email configuration is working perfectly!',
      messageId: testResult.messageId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('✗ Email configuration error:', error);
    res.json({ 
      success: false, 
      message: 'Email configuration failed',
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });
  }
};

// Send welcome email function
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: `"YungFlame" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Welcome to YungFlame! Account Created Successfully",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0;">Welcome to YungFlame!</h1>
          </div>
          <div style="background-color: white; padding: 20px; border-radius: 8px;">
            <p style="font-size: 16px; color: #333;">Hi <strong>${userName}</strong>,</p>
            <p style="font-size: 16px; color: #333;">🎉 Congratulations! Your YungFlame account has been created successfully.</p>
            <p style="font-size: 16px; color: #333;">You can now:</p>
            <ul style="color: #666;">
              <li>Browse our amazing collections</li>
              <li>Make purchases securely</li>
              <li>Track your orders</li>
              <li>Enjoy exclusive member benefits</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Shopping</a>
            </div>
          </div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #666; text-align: center;">If you have any questions, feel free to contact our support team.</p>
          <p style="font-size: 12px; color: #999; text-align: center;">© 2024 YungFlame. All rights reserved.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✓ Welcome email sent to:', userEmail);
  } catch (error) {
    console.error('✗ Error sending welcome email:', error.message);
  }
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Step 1: Send OTP for registration
const sendOtp = async (req, res) => {
  const { email } = req.body;
  
  console.log('=== SendOTP Request ===');
  console.log('Email requested:', email);
  
  if (!email || !validator.isEmail(email)) {
    console.log('✗ Invalid email provided');
    return res.status(400).json({ success: false, message: "Valid email required" });
  }

  try {
    // Check if user already exists
    const exists = await userModel.findOne({ email }).lean().exec();
    if (exists) {
      console.log('✗ User already exists:', email);
      return res.json({ success: false, message: "User already exists" });
    }

    const otp = generateOTP();
    console.log('Generated OTP for', email, ':', otp);

    // Store OTP with 5 min expiry
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
    console.log('OTP stored in memory');

    // Verify transporter before sending
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✓ SMTP connection verified');

    const mailOptions = {
      from: `"YungFlame" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your YungFlame Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #333; margin: 0;">Account Verification</h2>
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Your OTP for account verification is:</p>
            <div style="font-size: 32px; font-weight: bold; color: #007bff; background-color: white; padding: 15px; border-radius: 8px; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #666; font-size: 14px;">This OTP will expire in <strong>5 minutes</strong></p>
          </div>
          <div style="margin-top: 20px; padding: 15px; background-color: #fff3cd; border-radius: 5px;">
            <p style="color: #856404; font-size: 14px; margin: 0;">
              🔒 For security reasons, never share this OTP with anyone. YungFlame will never ask for your OTP via phone or email.
            </p>
          </div>
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
            If you didn't request this verification, please ignore this email.
          </p>
        </div>
      `,
    };

    console.log('Sending email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✓ Email sent successfully:', result.messageId);
    
    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("✗ Detailed sendOTP error:", error);
    
    // Specific error handling
    if (error.code === 'EAUTH') {
      res.json({ success: false, message: "Email authentication failed. Check credentials." });
    } else if (error.code === 'ECONNECTION' || error.code === 'ECONNREFUSED') {
      res.json({ success: false, message: "Cannot connect to email server" });
    } else if (error.responseCode === 535) {
      res.json({ success: false, message: "Invalid email credentials" });
    } else {
      res.json({ success: false, message: "Failed to send OTP: " + error.message });
    }
  }
};

// Step 2: Verify OTP & create user
const verifyOtpAndRegister = async (req, res) => {
  const { name, email, password, otp } = req.body;
  
  console.log('=== Verify OTP and Register ===');
  console.log('Email:', email, 'OTP:', otp);
  
  if (!name || !email || !password || !otp) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email" });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
  }

  const record = otpStore.get(email);
  if (!record) {
    console.log('✗ OTP not found for email:', email);
    return res.json({ success: false, message: "OTP expired or not found" });
  }
  
  if (record.expiresAt < Date.now()) {
    otpStore.delete(email);
    console.log('✗ OTP expired for email:', email);
    return res.json({ success: false, message: "OTP expired" });
  }
  
  if (record.otp !== otp) {
    console.log('✗ Invalid OTP for email:', email);
    return res.json({ success: false, message: "Invalid OTP" });
  }

  // OTP valid, delete it
  otpStore.delete(email);
  console.log('✓ OTP verified, proceeding with registration');

  // Check again if user exists (race condition safety)
  const exists = await userModel.findOne({ email }).lean().exec();
  if (exists) {
    return res.json({ success: false, message: "User already exists" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();
    console.log('✓ User created successfully:', user._id);

    // Send welcome email
    await sendWelcomeEmail(email, name);

    const token = createToken(user._id);

    res.json({ success: true, token, message: "Account created successfully!" });
  } catch (error) {
    console.error("✗ Error creating user:", error);
    res.json({ success: false, message: "Registration failed" });
  }
};

// Send OTP for forgot password
const sendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body;
  
  console.log('=== Forgot Password OTP Request ===');
  console.log('Email:', email);
  
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
    console.log('Generated forgot password OTP for', email, ':', otp);
    
    // Store OTP with 10 min expiry for forgot password
    forgotPasswordOtpStore.set(email, { 
      otp, 
      expiresAt: Date.now() + 10 * 60 * 1000,
      verified: false 
    });

    await transporter.sendMail({
      from: `"YungFlame" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP - YungFlame",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #dc3545; margin: 0;">Password Reset Request</h2>
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">You have requested to reset your password. Your OTP is:</p>
            <div style="font-size: 32px; font-weight: bold; color: #dc3545; background-color: white; padding: 15px; border-radius: 8px; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #666; font-size: 14px;">This OTP will expire in <strong>10 minutes</strong></p>
          </div>
          <div style="margin-top: 20px; padding: 15px; background-color: #f8d7da; border-radius: 5px;">
            <p style="color: #721c24; font-size: 14px; margin: 0;">
              ⚠️ If you didn't request this password reset, please ignore this email and ensure your account is secure.
            </p>
          </div>
        </div>
      `,
    });

    console.log('✓ Forgot password OTP sent to:', email);
    res.json({ success: true, message: "Password reset OTP sent to your email" });
  } catch (error) {
    console.error("✗ Error sending forgot password OTP:", error);
    res.json({ success: false, message: "Failed to send OTP" });
  }
};

// Verify forgot password OTP
const verifyForgotPasswordOtp = async (req, res) => {
  const { email, otp } = req.body;
  
  console.log('=== Verify Forgot Password OTP ===');
  console.log('Email:', email, 'OTP:', otp);
  
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
  console.log('✓ Forgot password OTP verified for:', email);

  res.json({ success: true, message: "OTP verified successfully" });
};

// Reset password after OTP verification
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  
  console.log('=== Reset Password ===');
  console.log('Email:', email);
  
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
    console.log('✓ Password reset successfully for:', email);

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("✗ Error resetting password:", error);
    res.json({ success: false, message: "Failed to reset password" });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('=== Login Attempt ===');
    console.log('Email:', email);
    
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log('✗ User not found:', email);
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      console.log('✓ User logged in successfully:', email);
      return res.json({ success: true, token });
    } else {
      console.log('✗ Invalid password for:', email);
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("✗ Login error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('=== Admin Login Attempt ===');
    console.log('Email:', email);
    
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      console.log('✓ Admin logged in successfully');
      res.json({ success: true, token });
    } else {
      console.log('✗ Invalid admin credentials');
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("✗ Admin login error:", error);
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
  testEmailConfig,
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