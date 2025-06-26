// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import { backendUrl, currency } from '../App'
// import { toast } from 'react-toastify'

// const List = ({token}) => {
//   const [list, setList] = useState([])

//   const fetchList = async () => {
//     try {
//       const response = await axios.get(backendUrl + '/api/product/list')
      
//       if (response.data.success) {
//         setList(response.data.products) 
//       } else {
//         toast.error(response.data.message)
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message)
//     }
//   }

//   const removeProduct = async (id) => {
//     try {
      
//       const response = await axios.post(backendUrl + '/api/product/remove', {id}, {headers:{token}})

//       if (response.data.success) {
//         toast.success(response.data.message)
//         await fetchList()
//       } else {
//         toast.error(response.data.message)
//       }

//     } catch (error) {
//       console.log(error);
//       toast.error(error.message)
//     }
//   }

//   useEffect(() => {
//     fetchList()
//   }, [])

//   return (
//     <>
//       <p className='mb-2'>Products List</p>
//       <div className='flex flex-col gap-2'>
//         {/* List Table Header */}
//         <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
//           <b>Image</b>
//           <b>Name</b>
//           <b>Category</b>
//           <b>Price</b>
//           <b className='text-center'>Action</b>
//         </div>

//         {/* Products List */}
//         {
//           list.map((item, index) => (  // ✅ Fixed: added return
//             <div key={index} className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm">
//               <img src={item.image[0]} alt='' className="w-12 h-12 object-cover" />
//               <p>{item.name}</p>
//               <p>{item.category}</p>
//               <p>{currency}{item.price}</p>
//               <p onClick={()=> removeProduct(item._id)} className="text-center cursor-pointer text-lg">X</p>
//             </div>
//           ))
//         }
//       </div>
//     </>
//   )
// }

// export default List


import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({token}) => {
  const [list, setList] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      
      if (response.data.success) {
        setList(response.data.products) 
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', {id}, {headers:{token}})

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const toggleOutOfStock = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/toggle-stock', 
        {id}, 
        {headers:{token}}
      )

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const openUpdateModal = (product) => {
    setSelectedProduct(product)
    setShowUpdateModal(true)
  }

  const closeUpdateModal = () => {
    setSelectedProduct(null)
    setShowUpdateModal(false)
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='mb-2'>Products List</p>
      <div className='flex flex-col gap-2'>
        {/* List Table Header */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Stock Status</b>
          <b className='text-center'>Actions</b>
        </div>

        {/* Products List */}
        {
          list.map((item, index) => (
            <div key={index} className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm">
              <img src={item.image[0]} alt='' className="w-12 h-12 object-cover" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              
              {/* Out of Stock Toggle */}
              <div className="text-center">
                <button
                  onClick={() => toggleOutOfStock(item._id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    item.outOfStock 
                      ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {item.outOfStock ? 'Out of Stock' : 'In Stock'}
                </button>
              </div>
              
              {/* Actions Column */}
              <div className="text-center flex justify-center gap-2">
                <button
                  onClick={() => openUpdateModal(item)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeProduct(item._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        }
      </div>

      {/* Update Product Modal */}
      {showUpdateModal && selectedProduct && (
        <UpdateProductModal 
          product={selectedProduct}
          token={token}
          onClose={closeUpdateModal}
          onUpdate={fetchList}
        />
      )}
    </>
  )
}

// Update Product Modal Component
const UpdateProductModal = ({ product, token, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    subCategory: product.subCategory,
    bestseller: product.bestseller,
    outOfStock: product.outOfStock,
    sizes: product.sizes
  })

  const [images, setImages] = useState({
    image1: false,
    image2: false,
    image3: false,
    image4: false
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const handleImageChange = (imageName, file) => {
    setImages(prev => ({
      ...prev,
      [imageName]: file
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const submitData = new FormData()
      
      // Add all form data
      submitData.append('id', product._id)
      submitData.append('name', formData.name)
      submitData.append('description', formData.description)
      submitData.append('price', formData.price)
      submitData.append('category', formData.category)
      submitData.append('subCategory', formData.subCategory)
      submitData.append('bestseller', formData.bestseller)
      submitData.append('outOfStock', formData.outOfStock)
      submitData.append('sizes', JSON.stringify(formData.sizes))

      // Add images if selected
      Object.entries(images).forEach(([key, file]) => {
        if (file) {
          submitData.append(key, file)
        }
      })

      const response = await axios.post(
        backendUrl + '/api/product/update',
        submitData,
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        onUpdate()
        onClose()
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Update Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <p className="mb-2 font-medium">Update Images (Optional)</p>
            <div className="flex gap-2">
              {['image1', 'image2', 'image3', 'image4'].map((imageName, index) => (
                <label key={imageName} className="cursor-pointer">
                  <div className="w-20 h-20 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {images[imageName] ? (
                      <img 
                        src={URL.createObjectURL(images[imageName])} 
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">Upload</span>
                    )}
                  </div>
                  <input
                    type="file"
                    hidden
                    onChange={(e) => handleImageChange(imageName, e.target.files[0])}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block font-medium mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              rows="3"
              required
            />
          </div>

          {/* Price, Category, SubCategory */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block font-medium mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Sub Category</label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Winter">Winter</option>
              </select>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block font-medium mb-2">Sizes</label>
            <div className="flex gap-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-3 py-1 rounded cursor-pointer ${
                    formData.sizes.includes(size) 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="bestseller"
                checked={formData.bestseller}
                onChange={handleInputChange}
                className="mr-2"
              />
              Bestseller
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                name="outOfStock"
                checked={formData.outOfStock}
                onChange={handleInputChange}
                className="mr-2"
              />
              Out of Stock
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Update Product
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default List