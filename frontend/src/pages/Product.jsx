

// import React, { useContext } from 'react'
// import { useParams } from 'react-router-dom'
// import { ShopContext } from '../context/ShopContext'
// import { useEffect, useState } from 'react'
// import { assets } from '../assets/assets'
// import RelatedProducts from '../components/RelatedProducts'

// const Product = () => {

//   const {productId} = useParams()
//   const {products, currency, addToCart} = useContext(ShopContext)
//   const [productData, setProductData] = useState(false)
//   const [image, setImage] = useState('')
//   const [size, setSize] = useState('')

//   const fetchProductData = async () => {
//     products.map((item)=>{
//       if (item._id === productId) {
//         setProductData(item)
//         setImage(item.image[0])
        
//         return null
//       }
//     })
//   }
 
//   useEffect(() => {
//     fetchProductData() 
//   },[productId, products])

//   return productData ? (
//     <div className='pt-10 transition-opacity ease-in duration-500 opacity-100'>

//       <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

//         {/* PRODUCT IMAGES */}
//         <div className='flex-1 flex flex-row gap-3'>

//           <div className='flex flex-col overflow-y-auto justify-start w-[18.7%]'>
//             {
//               productData.image.map((item, index) => (
//                 <img onClick={()=> setImage(item)} src={item} key={index} className='w-full mb-3 flex-shrink-0 cursor-pointer' alt='' />
//               ))
//             }
//           </div>

//           <div className='w-[80%]'>
//             <img className='w-full h-auto' src={image} alt='' />
//           </div>
//         </div>

//         {/* PRODUCT INFO */}

//         <div className='flex-1'>
//           <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>

//           <div className='flex items-center gap-1 mt-2'>
//             <img src={assets.star_icon} alt='' className='w-3 5' />
//             <img src={assets.star_icon} alt='' className='w-3 5' />
//             <img src={assets.star_icon} alt='' className='w-3 5' />
//             <img src={assets.star_icon} alt='' className='w-3 5' />
//             <img src={assets.star_icon} alt='' className='w-3 5' />
//             <p className='pl'>(122)</p>
//           </div>
//             <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
//             <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
//             <div className='flex flex-col gap-4 my-8'>
//               <p>Select Size</p>
//               <div className='flex gap-2'>
//                 {productData.sizes.map((item, index) => (
//                   <button onClick={()=>setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ?'border-orange-500' :''}`} key={index}>{item}</button>
//                 ))}
//               </div>
//             </div>
//             <button onClick={()=>addToCart(productData._id, size)} className='bg-black text-white px-8 py-3 text-sm activate:bg-gray-700'>Add to Cart</button>
//             <hr className='mt-8 sm:w-4/5'/>
//             <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
//               <p>100% Original Product</p>
//               <p>Cash on delivery is available on this product</p>

//             </div>
//         </div>
//       </div>
//       {/* DESCRIPTION AND REVIEW SECTION */}

//       <div className='mt-10'>
//         <div className='flex'>
//           <b className='border px-5 py-3 text-sm'>Description</b>
//           <p className='border px-5 py-3 text-sm'>Reviews (122)</p>        
//         </div>
//           <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
//              <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer.</p>
//              <p>E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>   
//           </div>
//       </div>

//       {/* DISPLAY RELATED PRODUCTS */}

//       <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

//     </div>
//   ) : <div className='opacity-0'></div>
// }

// export default Product

// 3. Updated Product.js
import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'
import { toast } from 'react-toastify'

const Product = () => {
  const {productId} = useParams()
  const {products, currency, addToCart} = useContext(ShopContext)
  const [productData, setProductData] = useState(false)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')

  const fetchProductData = async () => {
    products.map((item)=>{
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null
      }
    })
  }

  const handleAddToCart = () => {
    if (productData.outOfStock) {
      toast.error("This product is currently out of stock and cannot be added to cart");
      return;
    }
    
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    
    addToCart(productData._id, size);
    toast.success("Product added to cart successfully!");
  }
 
  useEffect(() => {
    fetchProductData() 
  },[productId, products])

  return productData ? (
    <div className='pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/* PRODUCT IMAGES */}
        <div className='flex-1 flex flex-row gap-3'>
          <div className='flex flex-col overflow-y-auto justify-start w-[18.7%]'>
            {
              productData.image.map((item, index) => (
                <img 
                  onClick={()=> setImage(item)} 
                  src={item} 
                  key={index} 
                  className={`w-full mb-3 flex-shrink-0 cursor-pointer ${productData.outOfStock ? 'opacity-50 grayscale' : ''}`} 
                  alt='' 
                />
              ))
            }
          </div>

          <div className='w-[80%] relative'>
            <img 
              className={`w-full h-auto ${productData.outOfStock ? 'opacity-50 grayscale' : ''}`} 
              src={image} 
              alt='' 
            />
            {productData.outOfStock && (
              <div className='absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center'>
                <span className='bg-red-600 text-white px-6 py-3 rounded-full text-lg font-semibold'>
                  OUT OF STOCK
                </span>
              </div>
            )}
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className='flex-1'>
          <h1 className={`font-medium text-2xl mt-2 ${productData.outOfStock ? 'text-gray-500' : ''}`}>
            {productData.name}
          </h1>

          {productData.outOfStock && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-3 mt-3'>
              <p className='text-red-600 font-semibold text-sm'>⚠️ This product is currently out of stock</p>
            </div>
          )}

          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt='' className='w-3 5' />
            <img src={assets.star_icon} alt='' className='w-3 5' />
            <img src={assets.star_icon} alt='' className='w-3 5' />
            <img src={assets.star_icon} alt='' className='w-3 5' />
            <img src={assets.star_icon} alt='' className='w-3 5' />
            <p className='pl'>(122)</p>
          </div>

          <p className={`mt-5 text-3xl font-medium ${productData.outOfStock ? 'text-gray-500' : ''}`}>
            {currency}{productData.price}
          </p>

          <p className={`mt-5 md:w-4/5 ${productData.outOfStock ? 'text-gray-400' : 'text-gray-500'}`}>
            {productData.description}
          </p>

          <div className='flex flex-col gap-4 my-8'>
            <p className={productData.outOfStock ? 'text-gray-400' : ''}>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button 
                  onClick={()=> !productData.outOfStock && setSize(item)} 
                  className={`border py-2 px-4 ${
                    productData.outOfStock 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : item === size 
                        ? 'border-orange-500 bg-gray-100' 
                        : 'bg-gray-100 hover:border-orange-300'
                  }`} 
                  key={index}
                  disabled={productData.outOfStock}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleAddToCart} 
            disabled={productData.outOfStock}
            className={`px-8 py-3 text-sm ${
              productData.outOfStock 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800 active:bg-gray-700'
            }`}
          >
            {productData.outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>

          <hr className='mt-8 sm:w-4/5'/>
          <div className={`text-sm mt-5 flex flex-col gap-1 ${productData.outOfStock ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>100% Original Product</p>
            <p>{productData.outOfStock ? 'Currently unavailable for delivery' : 'Cash on delivery is available on this product'}</p>
          </div>
        </div>
      </div>

      {/* DESCRIPTION AND REVIEW SECTION */}
      <div className='mt-10'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>        
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
           <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer.</p>
           <p>E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>   
        </div>
      </div>

      {/* DISPLAY RELATED PRODUCTS */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product
