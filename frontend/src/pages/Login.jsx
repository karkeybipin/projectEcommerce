// import React, { useContext, useEffect, useState } from 'react'
// import { ShopContext } from './../context/ShopContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const Login = () => {

//   const [currentState, setCurrentState] = useState('Login')
//   const {token, setToken, navigate, backendUrl} = useContext(ShopContext)

//   const [name, setName] = useState('')
//   const [password, setPassword] = useState('')
//   const [email, setEmail] = useState('')

//   const onSubmitHandler = async (event) => {
//     event.preventDefault()
//     try {

//       if (currentState === 'Sign Up') {

//         const response = await axios.post(backendUrl + '/api/user/register', {name, email, password})
        
//         if (response.data.success) {
//           setToken(response.data.token)
//           localStorage.setItem('token', response.data.token)
//         } else {
//           toast.error(response.data.message)
//         }


//       } else {

//         const response = await axios.post(backendUrl+'/api/user/login',{email, password})
//         if (response.data.success) {
//           setToken(response.data.token)
//           localStorage.setItem('token', response.data.token)
//         } else {
//           toast.error(response.data.message)
//         }
        
//       }

      
//     } catch (error) {
//       console.log(error)
//       toast.error(error.message)
//     }
//   }

//   useEffect(()=>{
//     if (token) {
//       navigate('/')
//     }
//   }, [token])

//   return (
//     <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
//       <div className='inline-flex items-center gap-2 mb-2 mt-10'>
//         <p className='prata-regular text-3xl'>{currentState}</p>
//         <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
//       </div>
//       {currentState === 'Login' ? '': <input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required /> }
//       <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
//       <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required/>
//       <div className='w-full flex justify-between text-sm mt-[-8px]'>
//         <p className='cursor-pointer'>Forgot your password?</p>
//         {
//           currentState === 'Login'
//           ? <p onClick={()=>setCurrentState('Sign Up') } className='cursor-pointer'>Create Account</p>
//           : <p onClick={()=>setCurrentState('Login') } className='cursor-pointer'>Login Here</p>
//         }
//       </div>
//       <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
//     </form>
//   )
// }

// export default Login

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------

// import React, { useContext, useEffect, useState } from 'react'
// import { ShopContext } from './../context/ShopContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const Login = () => {
  
//   const [currentState, setCurrentState] = useState('Login')
//   const {token, setToken, navigate, backendUrl} = useContext(ShopContext)
  
//   const [name, setName] = useState('')
//   const [password, setPassword] = useState('')
//   const [email, setEmail] = useState('')
  
//   const onSubmitHandler = async (event) => {
//     event.preventDefault()
//     try {
      
//       if (currentState === 'Sign Up') {
        
//         const response = await axios.post(backendUrl + '/api/user/register', {name, email, password})
        
//         if (response.data.success) {
//           setToken(response.data.token)
//           localStorage.setItem('token', response.data.token)
//           toast.success('Account created successfully! Welcome email sent.')
//         } else {
//           toast.error(response.data.message)
//         }
        
        
//       } else {
        
//         const response = await axios.post(backendUrl+'/api/user/login',{email, password})
//         if (response.data.success) {
//           setToken(response.data.token)
//           localStorage.setItem('token', response.data.token)
//         } else {
//           toast.error(response.data.message)
//         }
        
//       }
      
      
//     } catch (error) {
//       console.log(error)
//       toast.error(error.message)
//     }
//   }
  
//   useEffect(()=>{
//     if (token) {
//       navigate('/')
//     }
//   }, [token])
  
//   return (
//     <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
//       <div className='inline-flex items-center gap-2 mb-2 mt-10'>
//         <p className='prata-regular text-3xl'>{currentState}</p>
//         <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
//       </div>
//       {currentState === 'Login' ? '': <input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required /> }
//       <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
//       <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required/>
//       <div className='w-full flex justify-between text-sm mt-[-8px]'>
//         <p className='cursor-pointer'>Forgot your password?</p>
//         {
//           currentState === 'Login'
//           ? <p onClick={()=>setCurrentState('Sign Up') } className='cursor-pointer'>Create Account</p>
//           : <p onClick={()=>setCurrentState('Login') } className='cursor-pointer'>Login Here</p>
//         }
//       </div>
//       <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
//     </form>
//   )
// }

// export default Login


// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "./../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const [currentState, setCurrentState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + "/api/user/login", {
        email,
        password,
      });
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success("Logged in successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      if (!email) {
        toast.error("Please enter your email");
        return;
      }
      const response = await axios.post(backendUrl + "/api/user/send-otp", {
        email,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setOtpSent(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const verifyOtpAndRegister = async (e) => {
    e.preventDefault();
    try {
      if (!name || !password || !otp) {
        toast.error("Please fill all fields");
        return;
      }
      const response = await axios.post(backendUrl + "/api/user/verify-otp", {
        name,
        email,
        password,
        otp,
      });
      if (response.data.success) {
        toast.success("Registration successful! Please login now.");
        setCurrentState("Login");
        setName("");
        setPassword("");
        setEmail("");
        setOtp("");
        setOtpSent(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetSignupForm = () => {
    setName("");
    setPassword("");
    setEmail("");
    setOtp("");
    setOtpSent(false);
  };

  const switchToSignup = () => {
    resetSignupForm();
    setCurrentState("Sign Up");
  };

  const switchToLogin = () => {
    resetSignupForm();
    setCurrentState("Login");
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
            {currentState === "Login" && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin}
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
                  <p className="cursor-pointer hover:text-black transition-colors">
                    Forgot your password?
                  </p>
                  <p
                    onClick={switchToSignup}
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

            {currentState === "Sign Up" && (
              <AnimatePresence mode="wait">
                {!otpSent ? (
                  <motion.form
                    key="signup-email"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={sendOtp}
                    className="flex flex-col gap-5"
                  >
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
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Send OTP
                    </motion.button>
                    <p
                      onClick={switchToLogin}
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
                    onSubmit={verifyOtpAndRegister}
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
                        type="password"
                        placeholder="Password (min 8 chars)"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 outline-none"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 outline-none"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Verify & Register
                    </motion.button>
                    <p
                      onClick={switchToLogin}
                      className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium text-sm text-center transition-colors"
                    >
                      Already have an account? Login Here
                    </p>
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