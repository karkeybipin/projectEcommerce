

// import validator from "validator";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import userModel from "../models/userModel.js";

// const createToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET);
// };

// // ROUTE FOR USER LOGIN
// const loginUser = async (req, res) => {
//     try{
//         const {email, password} = req.body
//         const user = await userModel.findOne({email})

//         if (!user){
//             return res.json({success:false, message: 'User already exists'})
//         }
//         const isMatch = await bcrypt.compare(password, user.password)

//         if (isMatch){
//             const token = createToken(user._id)
//             res.json({success:true, token})
//         }
//         else{
//             res.json({success: false, message: 'Invalid Credentials'})
//         }

//     } catch (error){
//         console.log(error)
//         res.json({success: false, message: error.message})
//     }
// };

// // ROUTE FOR USER REGISTRATION
// const registerUser = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // Checking if user already exists or not with a timeout
//         const exists = await userModel.findOne({ email }).lean().exec();
//         if (exists) {
//             return res.json({ success: false, message: "User already exists" });
//         }

//         // Email format and strong password validation
//         if (!validator.isEmail(email)) {
//             return res.json({ success: false, message: "Please enter a valid email" });
//         }
//         if (password.length < 8) {
//             return res.json({ success: false, message: "Please enter a strong password" });
//         }

//         // Hashing user password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newUser = new userModel({
//             name,
//             email,
//             password: hashedPassword,
//         });

//         const user = await newUser.save();

//         const token = createToken(user._id);

//         res.json({ success: true, token });
//     } catch (error) {
//         // console.error("Registration Error:", error); // Log full error for debugging
//         // if (error.name === "MongoNetworkError" || error.message.includes("timed out")) {
//         //     return res.json({ success: false, message: "Database connection timed out. Please try again later." });
//         // }
//         // res.json({ success: false, message: `Registration failed: ${error.message}` });
//         console.log(error)
//         res.json({success: false, message: error.message})
//     }
// };

// // ROUTE FOR ADMIN LOGIN
// const adminLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body
//         if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
//             const token = jwt.sign(email+password , process.env.JWT_SECRET);
//             res.json({ success: true, token });
//         } else {
//             res.json({ success: false, message: "Invalid credentials" });
//         }
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }

// export { loginUser, registerUser, adminLogin };

// ------------------------------------------------------------------------------------------------------------------

// import validator from "validator";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import userModel from "../models/userModel.js";
// import nodemailer from "nodemailer";

// const createToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET);
// };

// // Configure nodemailer transporter
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// });

// // Function to send welcome email
// const sendWelcomeEmail = async (userEmail, userName) => {
//     try {
//         console.log('Attempting to send email to:', userEmail);
//         console.log('Email user configured:', process.env.EMAIL_USER);
        
//         const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: userEmail,
//             subject: 'Account Created Successfully!',
//             html: `
//                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//                     <h2 style="color: #333; text-align: center;">Welcome to Our YungFlame!</h2>
//                     <p style="font-size: 16px; color: #555;">Hi ${userName},</p>
//                     <p style="font-size: 16px; color: #555;">
//                         Congratulations! Your account has been created successfully.
//                     </p>
//                     <p style="font-size: 16px; color: #555;">
//                         You can now enjoy shopping on our platform. Thank you for joining us!
//                     </p>
//                     <div style="text-align: center; margin: 30px 0;">
//                         <p style="font-size: 16px; color: #333; font-weight: bold;">Happy Shopping!</p>
//                     </div>
//                     <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
//                     <p style="font-size: 14px; color: #888; text-align: center;">
//                         If you have any questions, feel free to contact our support team.
//                     </p>
//                 </div>
//             `
//         };

//         const result = await transporter.sendMail(mailOptions);
//         console.log('Welcome email sent successfully to:', userEmail);
//         console.log('Email result:', result.messageId);
//     } catch (error) {
//         console.error('Error sending welcome email:', error.message);
//         console.error('Full error:', error);
//         // Don't throw error - email failure shouldn't affect registration
//     }
// };

// // ROUTE FOR SENDING WELCOME EMAIL
// const sendWelcomeEmailRoute = async (req, res) => {
//     try {
//         const { email, name } = req.body;
        
//         if (!email || !name) {
//             return res.json({ success: false, message: "Email and name are required" });
//         }

//         await sendWelcomeEmail(email, name);
//         res.json({ success: true, message: "Welcome email sent successfully" });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: "Failed to send welcome email" });
//     }
// };

// // ROUTE FOR USER LOGIN
// const loginUser = async (req, res) => {
//     try{
//         const {email, password} = req.body
//         const user = await userModel.findOne({email})

//         if (!user){
//             return res.json({success:false, message: 'User does not exist'})
//         }
//         const isMatch = await bcrypt.compare(password, user.password)

//         if (isMatch){
//             const token = createToken(user._id)
//             res.json({success:true, token})
//         }
//         else{
//             res.json({success: false, message: 'Invalid Credentials'})
//         }

//     } catch (error){
//         console.log(error)
//         res.json({success: false, message: error.message})
//     }
// };

// // ROUTE FOR USER REGISTRATION
// const registerUser = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // Checking if user already exists or not with a timeout
//         const exists = await userModel.findOne({ email }).lean().exec();
//         if (exists) {
//             return res.json({ success: false, message: "User already exists" });
//         }

//         // Email format and strong password validation
//         if (!validator.isEmail(email)) {
//             return res.json({ success: false, message: "Please enter a valid email" });
//         }
//         if (password.length < 8) {
//             return res.json({ success: false, message: "Please enter a strong password" });
//         }

//         // Hashing user password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newUser = new userModel({
//             name,
//             email,
//             password: hashedPassword,
//         });

//         const user = await newUser.save();

//         const token = createToken(user._id);

//         // Send welcome email after successful registration
//         await sendWelcomeEmail(email, name);

//         res.json({ success: true, token });
//     } catch (error) {
//         console.log(error)
//         res.json({success: false, message: error.message})
//     }
// };

// // ROUTE FOR ADMIN LOGIN
// const adminLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body
//         if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
//             const token = jwt.sign(email+password , process.env.JWT_SECRET);
//             res.json({ success: true, token });
//         } else {
//             res.json({ success: false, message: "Invalid credentials" });
//         }
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: error.message });
//     }
// }

// export { loginUser, registerUser, adminLogin, sendWelcomeEmailRoute };

// -----------------------------------------------------------------------------------------------------------

import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";

// In-memory OTP store (replace with DB/Redis for production)
const otpStore = new Map();

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

// Step 1: Send OTP
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
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
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

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const { name, email, password } = req.body;

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

    // Prepare update data
    const updateData = {
      name: name.trim(),
      email: email.toLowerCase().trim()
    };

    // Handle password update if provided
    if (password && password.trim() !== '') {
      if (password.length < 8) {
        return res.status(400).json({ 
          success: false, 
          message: "Password must be at least 8 characters long" 
        });
      }
      
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

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





export {
  sendOtp,
  verifyOtpAndRegister,
  loginUser,
  adminLogin,
  sendWelcomeEmail,
  getUserProfile,
  updateUserProfile
};
