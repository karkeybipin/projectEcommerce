import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import {Link} from 'react-router-dom';

const ProductItem = ({ id, image, name, price, outOfStock }) => {
    const {currency} = useContext(ShopContext);

    return (
        <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
            <div className='overflow-hidden relative'>
                <img 
                    className={`hover:scale-110 transition ease-in-out ${outOfStock ? 'opacity-50 grayscale' : ''}`} 
                    src={image[0]} 
                    alt=''
                />
                {outOfStock && (
                    <div className='absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center'>
                        <span className='bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold'>
                            OUT OF STOCK
                        </span>
                    </div>
                )}
            </div>
            <p className={`pt-3 pb-1 text-sm ${outOfStock ? 'text-gray-400' : ''}`}>{name}</p>
            <p className={`text-sm font-medium ${outOfStock ? 'text-gray-400' : ''}`}>
                {currency}{price}
                {outOfStock && <span className='text-red-500 ml-2 text-xs'>(Out of Stock)</span>}
            </p>
        </Link>
    )
}

export default ProductItem
