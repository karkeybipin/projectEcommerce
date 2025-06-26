import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";

const AddOrderManually = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const delivery_fee = 10; // You can make this configurable

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

 const fetchProducts = async () => {
  try {
    // Change from POST to GET and remove unnecessary headers
    const response = await axios.get(
      backendUrl + "/api/product/list"
    );
    
    if (response.data.success) {
      setProducts(response.data.products);
    } else {
      toast.error("Failed to fetch products");
    }
  } catch (error) {
    console.log(error);
    toast.error("Error fetching products");
  }
};

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSelectedSize(""); // Reset size when product changes
    setQuantity(1); // Reset quantity
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  if (!selectedProduct) {
    toast.error("Please select a product");
    return;
  }

  if (!selectedSize) {
    toast.error("Please select a size");
    return;
  }

  try {
    const orderItems = [
      {
        _id: selectedProduct._id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.image,
        size: selectedSize,
        quantity: quantity,
        category: selectedProduct.category,
        subCategory: selectedProduct.subCategory,
      },
    ];

    const orderData = {
      userId: "manual_order_" + Date.now(), // Generate a unique ID for manual orders
      address: formData,
      items: orderItems,
      amount: selectedProduct.price * quantity + delivery_fee,
      payment: true, // Mark as paid for manual orders
      paymentMethod: "Manual Entry" // Indicate this was manually created
    };

    const response = await axios.post(
      backendUrl + "/api/order/place",
      orderData,
      { headers: { token } }
    );

    if (response.data.success) {
      toast.success("Order added successfully!");
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: "",
      });
      setSelectedProduct(null);
      setSelectedSize("");
      setQuantity(1);
    } else {
      toast.error(response.data.message || "Failed to add order");
    }
  } catch (error) {
    console.error("Order creation error:", error);
    toast.error("Failed to create order");
  }
};

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600">
            <h1 className="text-3xl font-bold text-white">Add Order Manually</h1>
            <p className="text-blue-100 mt-2">
              Create orders for social media sales or offline purchases
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Side - Customer Information */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Customer Information
                </h2>

                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        required
                        onChange={onChangeHandler}
                        name="firstName"
                        value={formData.firstName}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type="text"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        required
                        onChange={onChangeHandler}
                        name="lastName"
                        value={formData.lastName}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type="text"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name="email"
                      value={formData.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      type="email"
                      placeholder="Enter email address"
                    />
                  </div>

                  {/* Street */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name="street"
                      value={formData.street}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      type="text"
                      placeholder="Enter street address"
                    />
                  </div>

                  {/* City and State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        required
                        onChange={onChangeHandler}
                        name="city"
                        value={formData.city}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type="text"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        required
                        onChange={onChangeHandler}
                        name="state"
                        value={formData.state}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type="text"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>

                  {/* Zipcode and Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zip Code *
                      </label>
                      <input
                        required
                        onChange={onChangeHandler}
                        name="zipcode"
                        value={formData.zipcode}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type="number"
                        placeholder="Enter zip code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <input
                        required
                        onChange={onChangeHandler}
                        name="country"
                        value={formData.country}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        type="text"
                        placeholder="Enter country"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name="phone"
                      value={formData.phone}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      type="number"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Right Side - Product Selection */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Product Selection
                </h2>

                {/* Product List */}
                <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedProduct?._id === product._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="radio"
                          name="product"
                          checked={selectedProduct?._id === product._id}
                          onChange={() => handleProductSelect(product)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <img
                          src={product.image[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {product.category} - {product.subCategory}
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {currency}{product.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Size Selection */}
                {selectedProduct && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Size *
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {selectedProduct.sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                            selectedSize === size
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selection */}
                {selectedProduct && selectedSize && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                {/* Order Summary */}
                {selectedProduct && selectedSize && (
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Order Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Product Price:</span>
                        <span>{currency}{selectedProduct.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span>{quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{currency}{selectedProduct.price * quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span>{currency}{delivery_fee}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>{currency}{selectedProduct.price * quantity + delivery_fee}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-12 flex justify-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Create Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOrderManually;