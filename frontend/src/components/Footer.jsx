// import React from "react";
// import { assets } from "../assets/assets";

// const Footer = () => {
//   return (
//     <div>
//       <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-10 text-sm">
//         <img src={assets.logo} className="w-25 mb-5" alt="" />
//         <p className="w-100 md:w2/3 text-gray-600">
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
//           eiusmod tempor incididunt ut labore et dolore magna aliqua.
//         </p>
//         <div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Footer;

import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-10 text-m">
        <div>
          <img src={assets.logo} className="mb-5 w-15" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Careers</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+977-9876543210</li>
                <li>youremail@email.com</li>
            </ul>
        </div>

      </div>
      <div>
        <hr className='border-gray-300' />
        <p className='py-5 text-sm text-center'>Copyright 2025@ yungflame.com - All Rights Reserved </p>
      </div>

    </div>
  );
};

export default Footer;