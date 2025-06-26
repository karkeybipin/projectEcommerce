import React from 'react';
import { assets } from '../assets/assets';

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <img className="w-[max(10%,60px)] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" src={assets.adminlogo}  alt="" />
      <button onClick={()=>setToken('')} className='bg-black text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Log out</button>
    </div>
  );
};

export default Navbar;