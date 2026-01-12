
// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "./../context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from "framer-motion";

// const Login = () => {
//   const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
//   const [currentState, setCurrentState] = useState("Login");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);

//   useEffect(() => {
//     if (token) {
//       navigate("/");
//     }
//   }, [token, navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(backendUrl + "/api/user/login", {
//         email,
//         password,
//       });
//       if (response.data.success) {
//         setToken(response.data.token);
//         localStorage.setItem("token", response.data.token);
//         toast.success("Logged in successfully!");
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const sendOtp = async (e) => {
//     e.preventDefault();
//     try {
//       if (!email) {
//         toast.error("Please enter your email");
//         return;
//       }
//       const response = await axios.post(backendUrl + "/api/user/send-otp", {
//         email,
//       });
//       if (response.data.success) {
//         toast.success(response.data.message);
//         setOtpSent(true);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const verifyOtpAndRegister = async (e) => {
//     e.preventDefault();
//     try {
//       if (!name || !password || !otp) {
//         toast.error("Please fill all fields");
//         return;
//       }
//       const response = await axios.post(backendUrl + "/api/user/verify-otp", {
//         name,
//         email,
//         password,
//         otp,
//       });
//       if (response.data.success) {
//         toast.success("Registration successful! Please login now.");
//         setCurrentState("Login");
//         setName("");
//         setPassword("");
//         setEmail("");
//         setOtp("");
//         setOtpSent(false);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const resetSignupForm = () => {
//     setName("");
//     setPassword("");
//     setEmail("");
//     setOtp("");
//     setOtpSent(false);
//   };

//   const switchToSignup = () => {
//     resetSignupForm();
//     setCurrentState("Sign Up");
//   };

//   const switchToLogin = () => {
//     resetSignupForm();
//     setCurrentState("Login");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col justify-between">
//       {/* Main Form Container */}
//       <div className="flex items-center justify-center flex-grow">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-xl p-8"
//         >
//           <div className="flex items-center gap-3 mb-6">
//             <h2 className="prata-regular text-3xl font-semibold text-gray-800">
//               {currentState}
//             </h2>
//             <hr className="border-none h-1 w-12 bg-black rounded" />
//           </div>

//           <AnimatePresence mode="wait">
//             {currentState === "Login" && (
//               <motion.form
//                 key="login"
//                 initial={{ opacity: 0, x: -50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: 50 }}
//                 transition={{ duration: 0.3 }}
//                 onSubmit={handleLogin}
//                 className="flex flex-col gap-5"
//               >
//                 <div className="relative">
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 outline-none"
//                   />
//                 </div>
//                 <div className="relative">
//                   <input
//                     type="password"
//                     placeholder="Password"
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 outline-none"
//                   />
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-600">
//                   <p className="cursor-pointer hover:text-black transition-colors">
//                     Forgot your password?
//                   </p>
//                   <p
//                     onClick={switchToSignup}
//                     className="cursor-pointer text-black hover:text-black font-medium transition-colors"
//                   >
//                     Create Account
//                   </p>
//                 </div>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
//                 >
//                   Sign In
//                 </motion.button>
//               </motion.form>
//             )}

//             {currentState === "Sign Up" && (
//               <AnimatePresence mode="wait">
//                 {!otpSent ? (
//                   <motion.form
//                     key="signup-email"
//                     initial={{ opacity: 0, x: -50 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: 50 }}
//                     transition={{ duration: 0.3 }}
//                     onSubmit={sendOtp}
//                     className="flex flex-col gap-5"
//                   >
//                     <div className="relative">
//                       <input
//                         type="email"
//                         placeholder="Email"
//                         required
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 outline-none"
//                       />
//                     </div>
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
//                     >
//                       Send OTP
//                     </motion.button>
//                     <p
//                       onClick={switchToLogin}
//                       className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium text-sm text-center transition-colors"
//                     >
//                       Already have an account? Login Here
//                     </p>
//                   </motion.form>
//                 ) : (
//                   <motion.form
//                     key="signup-otp"
//                     initial={{ opacity: 0, x: -50 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: 50 }}
//                     transition={{ duration: 0.3 }}
//                     onSubmit={verifyOtpAndRegister}
//                     className="flex flex-col gap-5"
//                   >
//                     <div className="relative">
//                       <input
//                         type="text"
//                         placeholder="Name"
//                         required
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 outline-none"
//                       />
//                     </div>
//                     <div className="relative">
//                       <input
//                         type="password"
//                         placeholder="Password (min 8 chars)"
//                         required
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 outline-none"
//                       />
//                     </div>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         placeholder="Enter OTP"
//                         required
//                         value={otp}
//                         onChange={(e) => setOtp(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 outline-none"
//                       />
//                     </div>
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
//                     >
//                       Verify & Register
//                     </motion.button>
//                     <p
//                       onClick={switchToLogin}
//                       className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium text-sm text-center transition-colors"
//                     >
//                       Already have an account? Login Here
//                     </p>
//                   </motion.form>
//                 )}
//               </AnimatePresence>
//             )}
//           </AnimatePresence>
//         </motion.div>
//       </div>

      
//     </div>
//   );
// };

// export default Login;



import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ShopContext } from "./../context/ShopContext";

const Login = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState("Login");

  // Login/Register states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isForgotOtpSent, setIsForgotOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (currentState === "Sign Up") {
        if (!isOtpSent) {
          // Step 1: Send OTP
          const response = await axios.post(backendUrl + "/api/user/send-otp", {
            email,
          });
          if (response.data.success) {
            toast.success(response.data.message);
            setIsOtpSent(true);
          } else {
            toast.error(response.data.message);
          }
        } else {
          // Step 2: Verify OTP and Register
          const response = await axios.post(
            backendUrl + "/api/user/verify-otp",
            {
              name,
              email,
              password,
              otp,
            }
          );
          if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            toast.success("Account created successfully!");
          } else {
            toast.error(response.data.message);
          }
        }
      } else if (currentState === "Login") {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Login successful!");
        } else {
          toast.error(response.data.message);
        }
      } else if (currentState === "Forgot Password") {
        if (!isForgotOtpSent) {
          // Send OTP for forgot password
          const response = await axios.post(
            backendUrl + "/api/user/forgot-password-otp",
            { email: forgotEmail }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            setIsForgotOtpSent(true);
          } else {
            toast.error(response.data.message);
          }
        } else if (!isOtpVerified) {
          // Verify OTP
          const response = await axios.post(
            backendUrl + "/api/user/verify-forgot-otp",
            {
              email: forgotEmail,
              otp: forgotOtp,
            }
          );
          if (response.data.success) {
            toast.success("OTP verified! Please set your new password.");
            setIsOtpVerified(true);
          } else {
            toast.error(response.data.message);
          }
        } else {
          // Reset password
          if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
          }
          if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
          }

          const response = await axios.post(
            backendUrl + "/api/user/reset-password",
            {
              email: forgotEmail,
              newPassword,
            }
          );
          if (response.data.success) {
            toast.success(
              "Password reset successfully! Please login with your new password."
            );
            // Reset all states and switch to login
            handleStateChange("Login");
          } else {
            toast.error(response.data.message);
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Reset states when switching between forms
  const handleStateChange = (newState) => {
    setCurrentState(newState);
    setName("");
    setEmail("");
    setPassword("");
    setOtp("");
    setIsOtpSent(false);
    setForgotEmail("");
    setForgotOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setIsForgotOtpSent(false);
    setIsOtpVerified(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col justify-between">
      {/* Main Form Container */}
      <div className="flex items-center justify-center flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <h2 className="prata-regular text-3xl font-semibold text-gray-800">
              {currentState}
            </h2>
            <hr className="border-none h-1 w-12 bg-black rounded" />
          </div>

          <AnimatePresence mode="wait">
            {/* Login Form */}
            {currentState === "Login" && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                onSubmit={onSubmitHandler}
                className="flex flex-col gap-5"
              >
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 outline-none"
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 outline-none"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <p
                    className="cursor-pointer hover:text-black transition-colors"
                    onClick={() => handleStateChange("Forgot Password")}
                  >
                    Forgot your password?
                  </p>
                  <p
                    onClick={() => handleStateChange("Sign Up")}
                    className="cursor-pointer text-black hover:text-black font-medium transition-colors"
                  >
                    Create Account
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </motion.button>
              </motion.form>
            )}

            {/* Sign Up Form */}
            {currentState === "Sign Up" && (
              <AnimatePresence mode="wait">
                {!isOtpSent ? (
                  <motion.form
                    key="signup-initial"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={onSubmitHandler}
                    className="flex flex-col gap-5"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 outline-none"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 outline-none"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Password (min 8 chars)"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 outline-none"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Send OTP
                    </motion.button>
                    <p
                      onClick={() => handleStateChange("Login")}
                      className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium text-sm text-center transition-colors"
                    >
                      Already have an account? Login Here
                    </p>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup-otp"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={onSubmitHandler}
                    className="flex flex-col gap-5"
                  >
                    <p className="text-sm text-gray-600 text-center">
                      Enter the OTP sent to {email}
                    </p>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 outline-none"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Verify OTP & Create Account
                    </motion.button>
                    <p
                      onClick={() => setIsOtpSent(false)}
                      className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium text-sm text-center transition-colors"
                    >
                      Back to registration
                    </p>
                    <p
                      onClick={() => handleStateChange("Login")}
                      className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium text-sm text-center transition-colors"
                    >
                      Already have an account? Login Here
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            )}

            {/* Forgot Password Form */}
            {currentState === "Forgot Password" && (
              <AnimatePresence mode="wait">
                {!isForgotOtpSent ? (
                  <motion.form
                    key="forgot-email"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={onSubmitHandler}
                    className="flex flex-col gap-5"
                  >
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Enter your email address to receive a password reset OTP
                    </p>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 outline-none"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Send Reset OTP
                    </motion.button>
                    <div className="flex justify-between text-sm text-gray-600">
                      <p
                        onClick={() => handleStateChange("Login")}
                        className="cursor-pointer hover:text-indigo-600 transition-colors"
                      >
                        Back to Login
                      </p>
                      <p
                        onClick={() => handleStateChange("Sign Up")}
                        className="cursor-pointer hover:text-indigo-600 transition-colors"
                      >
                        Create account
                      </p>
                    </div>
                  </motion.form>
                ) : !isOtpVerified ? (
                  <motion.form
                    key="forgot-otp"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={onSubmitHandler}
                    className="flex flex-col gap-5"
                  >
                    <p className="text-sm text-gray-600 text-center">
                      Enter the OTP sent to {forgotEmail}
                    </p>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        required
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        maxLength="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 outline-none"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Verify OTP
                    </motion.button>
                    <p
                      onClick={() => setIsForgotOtpSent(false)}
                      className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium text-sm text-center transition-colors"
                    >
                      Back to email entry
                    </p>
                  </motion.form>
                ) : (
                  <motion.form
                    key="forgot-reset"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={onSubmitHandler}
                    className="flex flex-col gap-5"
                  >
                    <p className="text-sm text-gray-600 text-center mb-4">
                      Set your new password
                    </p>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="New Password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 outline-none"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 outline-none"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Reset Password
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;