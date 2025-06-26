// import React from 'react'
// import Title from '../components/Title'
// import { assets } from '../assets/assets'

// const About = () => {
//   return (
//     <div>

//       <div className='text-2xl text-center pt-8 border-t'>
//         <Title text1={'ABOUT'} text2={'US'} />
//       </div>
//       <div className='my-10 flex flex-col md:flex-row gap-16'>
//         <img className='w-full md:max-w-[450px]' src={assets.about_img} alt='' />
//         <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
//           <p>Welcome to Yung Flame — where style meets individuality. We're not just a brand; we're a movement for the bold, creative, and unapologetically authentic. At Yung Flame, we believe fashion is a form of self-expression, and every product we create reflects the fire within — your unique personality, vibe, and voice. Whether it's streetwear, accessories, or lifestyle essentials, our goal is to fuel your confidence and help you stand out in a world that often asks you to blend in.</p>
//           <p>Born from culture, driven by passion. Yung Flame was created with the vision of bridging raw street style with premium quality and innovation. We stay rooted in the latest trends while carving out a space for originality and future-forward designs. Every drop is crafted with intention — bold, limited, and made to spark attention. Join the Flame community and ignite your style journey with us.</p>
//           <b className='text-gray-800'>Our Mission</b>
//           <p>At Yung Flame, our mission is to empower the next generation to express themselves fearlessly through bold fashion and original street culture. We aim to break the mold by creating standout designs that inspire confidence, creativity, and authenticity. Every piece we release is more than just apparel — it's a statement, a movement, and a reflection of the fire that lives within each of us.</p>   
//         </div>
//       </div>

//       <div className='text-xl py-4'> 
//         <Title text1={'WHY'} text2={'CHOOSE US'} />
//       </div>

//       <div className='flex flex-col md:flex md:flex-row text-sm mb-20'>
//         <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
//           <b>Quality Assurance:</b>
//           <p className='text-gray-600'>At Yung Flame, quality is at the core of everything we do. From fabric to finish, every product undergoes strict checks to ensure durability, comfort, and style. We partner with trusted manufacturers and use premium materials to deliver pieces that meet high standards — because you deserve nothing less than the best.</p>
//         </div>
//         <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
//           <b>Convenience:</b>
//           <p className='text-gray-600'>Shopping with Yung Flame is easy, fast, and seamless. Our user-friendly website, secure checkout, and reliable delivery options are designed to make your experience smooth from start to finish — so you can focus on expressing your style, not stressing about the process.</p>
//         </div>
//         <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
//           <b>Exceptional Customer Service:</b>
//           <p className='text-gray-600'>We’ve got your back. At Yung Flame, we’re committed to providing quick, friendly, and reliable customer support. Whether you have a question, need help with an order, or just want to drop feedback, our team is here to make sure you're fully satisfied — every time.</p>
//         </div>
//       </div>
      
//     </div>
//   )
// }

// export default About

import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const About = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <motion.div
        className="text-center pt-16 pb-10 bg-gradient-to-b from-gray-100 to-gray-50"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Title text1={'ABOUT'} text2={'US'} />
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Ignite your style with Yung Flame — where bold fashion meets fearless individuality.
        </p>
      </motion.div>

      {/* About Content Section */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16 flex flex-col md:flex-row gap-12 items-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Image with Hover Effect */}
        <motion.div className="w-full md:w-1/2" variants={fadeIn}>
          <div className="relative group">
            <img
              className="w-full rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-500"
              src={assets.about_img}
              alt="Yung Flame"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div className="w-full md:w-1/2 flex flex-col gap-6 text-gray-600" variants={fadeIn}>
          <h2 className="text-2xl font-bold text-gray-900">Welcome to Yung Flame</h2>
          <p className="text-base leading-relaxed">
            Yung Flame isn’t just a brand—it’s a movement for the bold, creative, and authentic. We believe fashion is self-expression, and our streetwear, accessories, and lifestyle essentials are designed to fuel your unique vibe. Stand out in a world that asks you to blend in.
          </p>
          <p className="text-base leading-relaxed">
            Born from culture, driven by passion. We fuse raw street style with premium quality and innovation. Every drop is bold, limited, and crafted to spark attention. Join the Flame community and ignite your style journey.
          </p>
          <h3 className="text-xl font-semibold text-gray-800">Our Mission</h3>
          <p className="text-base leading-relaxed">
            We empower the next generation to express themselves fearlessly through bold fashion and original street culture. Our designs break molds, inspire confidence, and reflect the fire within.
          </p>
        </motion.div>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-12" variants={fadeIn}>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={staggerContainer}>
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
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
              variants={fadeIn}
              whileHover={{ y: -5 }}
            >
              <h4 className="text-lg font-bold text-gray-900 mb-4">{item.title}</h4>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;