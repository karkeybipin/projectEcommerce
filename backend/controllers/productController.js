// import {v2 as cloudinary} from 'cloudinary'
// import productModel from '../models/productModel.js'


// // function for adding product
// const addProduct = async (req,res) => {
//     try {
//         const {name, description, price, category, subCategory, sizes, bestseller} = req.body
        
//         const image1 = req.files.image1 && req.files.image1[0]
//         const image2 = req.files.image2 && req.files.image2[0]
//         const image3 = req.files.image3 && req.files.image3[0]
//         const image4 = req.files.image4 && req.files.image4[0]

//         const images = [image1, image2, image3, image4].filter((item)=> item !== undefined)

//         let imagesURL = await Promise.all(
//             images.map(async(item)=>{
//                 let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'})
//                 return result.secure_url
//             })
//         )

//         const productData = {
//             name,
//             description,
//             category,
//             price: Number(price),
//             subCategory,
//             bestseller: bestseller === 'true' ? true:false,
//             sizes: JSON.parse(sizes),
//             image: imagesURL,
//             date: Date.now()
//         }

//         console.log(productData);
        
//         const product = new productModel(productData)
//         await product.save()

//         res.json({success:true, message: "Product Added" })

//     } catch (error) {
//         console.log(error)
//         res.json({success: false, message: error.message})
//     }
// }

// // function for listing products
// const listProducts = async (req,res) => {
//     try{
//         const products = await productModel.find({})
//         res.json({success:true, products})
//     } catch (error) {
//         console.log(error)
//         res.json({success: false, message: error.message})
//     }
// }

// // function for removing products
// const removeProduct = async (req, res) => {
//     try {
//         await productModel.findByIdAndDelete(req.body.id)
//         res.json({ success: true, message: "Product Removed" })
//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

// // function for single product info
// const singleProduct = async (req, res) => {
//     try {
//         const { productId } = req.body
//         const product = await productModel.findById(productId)
//         res.json({ success: true, product })
//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

// export {
//     addProduct, listProducts, removeProduct, singleProduct
// }


import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/productModel.js'

// function for adding product
const addProduct = async (req,res) => {
    try {
        const {name, description, price, category, subCategory, sizes, bestseller} = req.body
        
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item)=> item !== undefined)

        let imagesURL = await Promise.all(
            images.map(async(item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'})
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === 'true' ? true:false,
            outOfStock: false, // Default to in stock
            sizes: JSON.parse(sizes),
            image: imagesURL,
            date: Date.now()
        }

        console.log(productData);
        
        const product = new productModel(productData)
        await product.save()

        res.json({success:true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// function for listing products
const listProducts = async (req,res) => {
    try{
        const products = await productModel.find({})
        res.json({success:true, products})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// function for removing products
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product Removed" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({ success: true, product })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for updating product
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, sizes, bestseller, outOfStock } = req.body
        
        // Check if product exists
        const existingProduct = await productModel.findById(id)
        if (!existingProduct) {
            return res.json({ success: false, message: "Product not found" })
        }

        // Handle image uploads if provided
        let imagesURL = existingProduct.image // Keep existing images by default
        
        if (req.files && Object.keys(req.files).length > 0) {
            const image1 = req.files.image1 && req.files.image1[0]
            const image2 = req.files.image2 && req.files.image2[0]
            const image3 = req.files.image3 && req.files.image3[0]
            const image4 = req.files.image4 && req.files.image4[0]

            const images = [image1, image2, image3, image4].filter((item) => item !== undefined)
            
            if (images.length > 0) {
                imagesURL = await Promise.all(
                    images.map(async(item) => {
                        let result = await cloudinary.uploader.upload(item.path, {resource_type:'image'})
                        return result.secure_url
                    })
                )
            }
        }

        const updateData = {
            name: name || existingProduct.name,
            description: description || existingProduct.description,
            price: price ? Number(price) : existingProduct.price,
            category: category || existingProduct.category,
            subCategory: subCategory || existingProduct.subCategory,
            bestseller: bestseller !== undefined ? (bestseller === 'true' || bestseller === true) : existingProduct.bestseller,
            outOfStock: outOfStock !== undefined ? (outOfStock === 'true' || outOfStock === true) : existingProduct.outOfStock,
            sizes: sizes ? JSON.parse(sizes) : existingProduct.sizes,
            image: imagesURL
        }

        const updatedProduct = await productModel.findByIdAndUpdate(id, updateData, { new: true })
        
        res.json({ success: true, message: "Product Updated Successfully", product: updatedProduct })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for toggling out of stock status
const toggleOutOfStock = async (req, res) => {
    try {
        const { id } = req.body
        
        const product = await productModel.findById(id)
        if (!product) {
            return res.json({ success: false, message: "Product not found" })
        }

        // Toggle the outOfStock status
        const updatedProduct = await productModel.findByIdAndUpdate(
            id, 
            { outOfStock: !product.outOfStock }, 
            { new: true }
        )
        
        const status = updatedProduct.outOfStock ? "out of stock" : "in stock"
        res.json({ 
            success: true, 
            message: `Product marked as ${status}`, 
            product: updatedProduct 
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    addProduct, 
    listProducts, 
    removeProduct, 
    singleProduct, 
    updateProduct, 
    toggleOutOfStock
}