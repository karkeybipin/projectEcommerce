import React from "react";
import { assets } from "../assets/assets";
import C8580 from '../assets/C8580.mp4'; 

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">Lastest Drop</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">Maya Drop</h1>
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="text-sm md:text-base">SHOP NOW</p>
            </div>
        </div>
      </div>
      {/* Hero Right Side */}
      <img className="w-full sm:w-1/2" src={assets.hero_imgg} alt="hero"/>
      {/* <video
        className="w-full sm:w-1/2"
        src={C8580}
        autoPlay
        muted
        loop
        playsInline
      /> */}
    </div>
  );
};

export default Hero;

// import React, { useState, useEffect } from "react";
// import { assets } from "../assets/assets";

// const Hero = () => {
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     setIsLoaded(true);

//     const handleMouseMove = (e) => {
//       setMousePosition({
//         x: (e.clientX / window.innerWidth) * 100,
//         y: (e.clientY / window.innerHeight) * 100,
//       });
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   const handleShopNow = () => {
//     window.location.href = "/collection";
//   };

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 opacity-30">
//         <div
//           className="absolute w-96 h-96 bg-gradient-to-r from-gray-700 to-gray-500 rounded-full blur-3xl animate-pulse"
//           style={{
//             left: `${mousePosition.x * 0.02}%`,
//             top: `${mousePosition.y * 0.02}%`,
//             transform: "translate(-50%, -50%)",
//           }}
//         />
//         <div
//           className="absolute w-80 h-80 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full blur-3xl animate-pulse delay-1000"
//           style={{
//             right: `${mousePosition.x * 0.01}%`,
//             bottom: `${mousePosition.y * 0.01}%`,
//             transform: "translate(50%, 50%)",
//           }}
//         />
//       </div>

//       {/* Floating Particles */}
//       <div className="absolute inset-0 overflow-hidden">
//         {[...Array(20)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 5}s`,
//               animationDuration: `${3 + Math.random() * 4}s`,
//             }}
//           />
//         ))}
//       </div>

//       <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
//         {/* Hero Left Side */}
//         <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
//           <div
//             className={`text-white transform transition-all duration-1000 ${
//               isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
//             }`}
//           >
//             {/* Latest Drop Badge */}
//             <div className="flex items-center gap-3 mb-8 group">
//               <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-gray-400 to-gray-400 transition-all duration-500 group-hover:w-16"></div>
//               <span className="font-light text-sm tracking-[0.2em] uppercase text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
//                 Latest Drop
//               </span>
//               <div className="w-4 h-4 border border-gray-400 rotate-45 group-hover:rotate-90 transition-transform duration-300"></div>
//             </div>

//             {/* Main Title */}
//             <h1 className="text-7xl lg:text-9xl font-extrabold mb-8 bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent animate-gradient leading-tight">
//               Maya Drop
//             </h1>

//             {/* Subtitle */}
//             <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-md">
//               Discover the extraordinary collection that redefines luxury and
//               style
//             </p>

//             {/* CTA Button */}
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-gray-400 to-gray-400"></div>
//               <button
//                 onClick={handleShopNow}
//                 className="group relative px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full font-semibold text-white tracking-wide uppercase text-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/40"
//               >
//                 <span className="relative z-10 flex items-center gap-2">
//                   Shop Now
//                   <svg
//                     className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M17 8l4 4m0 0l-4 4m4-4H3"
//                     />
//                   </svg>
//                 </span>
//                 <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Hero Right Side */}
//         <div className="w-full lg:w-1/2 relative flex items-center justify-center p-8">
//           <div
//             className={`relative transform transition-all duration-1000 delay-300 ${
//               isLoaded ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
//             }`}
//           >
//             {/* Decorative Frame */}
//             <div className="absolute -inset-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded-3xl blur opacity-75 animate-pulse"></div>

//             {/* Main Image Container */}
//             <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl w-full max-w-[900px] h-[600px] lg:h-[720px]">
//               <img
//                 className="w-full h-full object-contain transition-transform duration-700 hover:scale-110"
//                 src={assets.hero_imgg}
//                 alt="Maya Drop Collection"
//                 loading="eager"
//                 decoding="sync"
//               />

//               {/* Overlay Effects */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

//               {/* Floating Action Button */}
//               <button
//                 onClick={handleShopNow}
//                 className="absolute bottom-8 right-8 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 group"
//               >
//                 <svg
//                   className="w-6 h-6 text-gray-800 group-hover:text-gray-600 transition-colors duration-300"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
//                   />
//                 </svg>
//               </button>
//             </div>

//             {/* Floating Info Cards */}
//             <div className="absolute -left-8 top-20 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 animate-float">
//               <div className="text-white text-sm font-semibold">New Collection</div>
//               <div className="text-gray-400 text-xs">Limited Edition</div>
//             </div>

//             <div className="absolute -right-8 bottom-20 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 animate-float delay-1000">
//               <div className="text-white text-sm font-semibold">Limited Stock</div>
//               <div className="text-gray-400 text-xs">Act fast before it's gone</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes gradient {
//           0%,
//           100% {
//             background-position: 0% 50%;
//           }
//           50% {
//             background-position: 100% 50%;
//           }
//         }

//         @keyframes float {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translateY(-10px) rotate(180deg);
//           }
//         }

//         .animate-gradient {
//           background-size: 200% 200%;
//           animation: gradient 3s ease infinite;
//         }

//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Hero;
