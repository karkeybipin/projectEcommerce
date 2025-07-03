
// import React from 'react';
// import Title from '../components/Title';
// import { assets } from '../assets/assets';
// import { motion } from 'framer-motion';

// const About = () => {
//   const fadeIn = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
//   };

//   const staggerContainer = {
//     hidden: { opacity: 1 },
//     visible: {
//       opacity: 1,
//       transition: { staggerChildren: 0.2 },
//     },
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Hero Section */}
//       <motion.div
//         className="text-center pt-16 pb-10 bg-gradient-to-b from-gray-100 to-gray-50"
//         initial="hidden"
//         animate="visible"
//         variants={fadeIn}
//       >
//         <Title text1={'ABOUT'} text2={'US'} />
//         <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
//           Ignite your style with Yung Flame — where bold fashion meets fearless individuality.
//         </p>
//       </motion.div>

//       {/* About Content Section */}
//       <motion.div
//         className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 flex flex-col md:flex-row gap-12 items-center"
//         variants={staggerContainer}
//         initial="hidden"
//         animate="visible"
//       >
//         {/* Image with Hover Effect */}
//         <motion.div className="w-full md:w-1/2" variants={fadeIn}>
//           <div className="relative group">
//             <img
//               className="w-full rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-500"
//               src={assets.about_img}
//               alt="Yung Flame"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
//           </div>
//         </motion.div>

//         {/* Text Content */}
//         <motion.div className="w-full md:w-1/2 flex flex-col gap-6 text-gray-600" variants={fadeIn}>
//           <h2 className="text-2xl font-bold text-gray-900">Welcome to Yung Flame</h2>
//           <p className="text-base leading-relaxed">
//             Yung Flame isn’t just a brand—it’s a movement for the bold, creative, and authentic. We believe fashion is self-expression, and our streetwear, accessories, and lifestyle essentials are designed to fuel your unique vibe. Stand out in a world that asks you to blend in.
//           </p>
//           <p className="text-base leading-relaxed">
//             Born from culture, driven by passion. We fuse raw street style with premium quality and innovation. Every drop is bold, limited, and crafted to spark attention. Join the Flame community and ignite your style journey.
//           </p>
//           <h3 className="text-xl font-semibold text-gray-800">Our Mission</h3>
//           <p className="text-base leading-relaxed">
//             We empower the next generation to express themselves fearlessly through bold fashion and original street culture. Our designs break molds, inspire confidence, and reflect the fire within.
//           </p>
//         </motion.div>
//       </motion.div>

//       {/* Why Choose Us */}
//       <motion.div
//         className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
//         variants={staggerContainer}
//         initial="hidden"
//         animate="visible"
//       >
//         <motion.div className="text-center mb-12" variants={fadeIn}>
//           <Title text1={'WHY'} text2={'CHOOSE US'} />
//         </motion.div>

//         <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={staggerContainer}>
//           {[
//             {
//               title: 'Quality Assurance',
//               description:
//                 'From fabric to finish, every Yung Flame product undergoes strict quality checks. We use premium materials and trusted partners to deliver durable, comfortable, and stylish pieces.',
//             },
//             {
//               title: 'Convenience',
//               description:
//                 'Shop with ease on our user-friendly website. Enjoy secure checkout and reliable delivery, so you can focus on expressing your style without the hassle.',
//             },
//             {
//               title: 'Exceptional Customer Service',
//               description:
//                 'Our team is here for you. Get quick, friendly, and reliable support for any questions or needs, ensuring your satisfaction every time.',
//             },
//           ].map((item, index) => (
//             <motion.div
//               key={index}
//               className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
//               variants={fadeIn}
//               whileHover={{ y: -5 }}
//             >
//               <h4 className="text-lg font-bold text-gray-900 mb-4">{item.title}</h4>
//               <p className="text-gray-600 leading-relaxed">{item.description}</p>
//             </motion.div>
//           ))}
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default About;

import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const About = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <motion.div
        className="text-center pt-20 pb-12 bg-gradient-to-b from-white to-gray-100"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Title text1={'ABOUT'} text2={'US'} />
        <p className="mt-5 text-lg text-gray-700 max-w-3xl mx-auto font-light tracking-wide">
          Ignite your style with Yung Flame — where bold fashion meets fearless individuality.
        </p>
      </motion.div>

      {/* About Content Section */}
      <motion.div
        className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 my-20 flex flex-col md:flex-row gap-16 items-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Image with Hover Effect */}
        <motion.div className="w-full md:w-1/2 rounded-xl shadow-2xl overflow-hidden" variants={fadeIn}>
          <div className="relative group cursor-pointer">
            <img
              className="w-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
              src={assets.hero_imgg}
              alt="Yung Flame Hero"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-700 rounded-xl"></div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div className="w-full md:w-1/2 flex flex-col gap-8 text-gray-700" variants={fadeIn}>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome to Yung Flame</h2>
          <p className="text-lg leading-relaxed font-light">
            Yung Flame isn’t just a brand—it’s a movement for the bold, creative, and authentic. We believe fashion is self-expression, and our streetwear, accessories, and lifestyle essentials are designed to fuel your unique vibe. Stand out in a world that asks you to blend in.
          </p>
          <p className="text-lg leading-relaxed font-light">
            Born from culture, driven by passion. We fuse raw street style with premium quality and innovation. Every drop is bold, limited, and crafted to spark attention. Join the Flame community and ignite your style journey.
          </p>
          <h3 className="text-2xl font-semibold text-gray-900 mt-4">Our Mission</h3>
          <p className="text-lg leading-relaxed font-light">
            We empower the next generation to express themselves fearlessly through bold fashion and original street culture. Our designs break molds, inspire confidence, and reflect the fire within.
          </p>
        </motion.div>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div
        className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-16" variants={fadeIn}>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto font-light tracking-wide">
            Discover what sets Yung Flame apart and why our community trusts us.
          </p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-10" variants={staggerContainer}>
          {[
            {
              title: 'Quality Assurance',
              description:
                'From fabric to finish, every Yung Flame product undergoes strict quality checks. We use premium materials and trusted partners to deliver durable, comfortable, and stylish pieces.',
            },
            {
              title: 'Convenience',
              description:
                'Shop with ease on our user-friendly website. Enjoy secure checkout and reliable delivery, so you can focus on expressing your style without the hassle.',
            },
            {
              title: 'Exceptional Customer Service',
              description:
                'Our team is here for you. Get quick, friendly, and reliable support for any questions or needs, ensuring your satisfaction every time.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-400 cursor-pointer"
              variants={fadeIn}
              whileHover={{ y: -8, boxShadow: '0 20px 30px rgba(59, 130, 246, 0.3)' }}
            >
              <h4 className="text-xl font-semibold text-gray-900 mb-4 tracking-wide">{item.title}</h4>
              <p className="text-gray-700 leading-relaxed font-light">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
