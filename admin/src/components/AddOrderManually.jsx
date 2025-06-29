import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";

// Nepal Provinces and Districts Data
const nepalData = {
  "Province 1 (Koshi Province)": [
    "Bhojpur", "Dhankuta", "Ilam", "Jhapa", "Khotang", "Morang", 
    "Okhaldhunga", "Panchthar", "Sankhuwasabha", "Solukhumbu", 
    "Sunsari", "Taplejung", "Terhathum", "Udayapur"
  ],
  "Province 2 (Madhesh Province)": [
    "Bara", "Dhanusha", "Mahottari", "Parsa", "Rautahat", 
    "Saptari", "Sarlahi", "Siraha"
  ],
  "Province 3 (Bagmati Province)": [
    "Bhaktapur", "Chitwan", "Dhading", "Dolakha", "Kathmandu", 
    "Kavrepalanchok", "Lalitpur", "Makwanpur", "Nuwakot", 
    "Rasuwa", "Ramechhap", "Sindhuli", "Sindhupalchok"
  ],
  "Province 4 (Gandaki Province)": [
    "Baglung", "Gorkha", "Kaski", "Lamjung", "Manang", 
    "Mustang", "Myagdi", "Nawalpur", "Parbat", "Syangja", "Tanahun"
  ],
  "Province 5 (Lumbini Province)": [
    "Arghakhanchi", "Banke", "Bardiya", "Dang", "Gulmi", 
    "Kapilvastu", "Palpa", "Parasi", "Pyuthan", "Rolpa", 
    "Rukum East", "Rupandehi"
  ],
  "Province 6 (Karnali Province)": [
    "Dailekh", "Dolpa", "Humla", "Jajarkot", "Jumla", 
    "Kalikot", "Mugu", "Rukum West", "Salyan", "Surkhet"
  ],
  "Province 7 (Sudurpashchim Province)": [
    "Achham", "Baitadi", "Bajhang", "Bajura", "Dadeldhura", 
    "Darchula", "Doti", "Kailali", "Kanchanpur"
  ]
};

// Get all districts for when no province is selected
const getAllDistricts = () => {
  const allDistricts = [];
  Object.values(nepalData).forEach(districts => {
    allDistricts.push(...districts);
  });
  return allDistricts.sort();
};

const AddOrderManually = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    // If state changes, reset city
    if (name === "state") {
      setFormData((data) => ({ ...data, [name]: value, city: "" }));
    } else {
      setFormData((data) => ({ ...data, [name]: value }));
    }
  };

  // Get available districts based on selected province
  const getAvailableDistricts = () => {
    if (formData.state && nepalData[formData.state]) {
      return nepalData[formData.state];
    }
    return getAllDistricts(); // Show all districts if no province selected
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
      setLoading(true);
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
        items: orderItems,
        amount: selectedProduct.price * quantity + delivery_fee,
        address: formData,
        paymentMethod: "Manual Entry", // Indicate this was manually created
      };

      // Use the manual order endpoint
      const response = await axios.post(
        backendUrl + "/api/order/place-manually",
        orderData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order added successfully! Status: Done, Payment: Completed");
        
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
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = () => {
    if (!selectedProduct) return delivery_fee;
    return selectedProduct.price * quantity + delivery_fee;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="lg:grid lg:grid-cols-2 lg:gap-x-12"
          >
            {/* ------------------ LEFT SIDE - CUSTOMER INFORMATION --------------------- */}
            <div className="px-6 py-8 sm:px-8 lg:px-10">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">CUSTOMER</h2>
                  <h2 className="text-2xl font-bold text-blue-600">INFORMATION</h2>
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Admin Manual Entry
                </div>
              </div>

              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name="firstName"
                      value={formData.firstName}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      type="text"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name="lastName"
                      value={formData.lastName}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      type="text"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="email"
                    value={formData.email}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    type="email"
                    placeholder="Enter email address"
                  />
                </div>

                {/* Street */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="street"
                    value={formData.street}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    type="text"
                    placeholder="Enter street address"
                  />
                </div>

                {/* State and City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Province
                    </label>
                    <select
                      required
                      onChange={onChangeHandler}
                      name="state"
                      value={formData.state}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Province</option>
                      {Object.keys(nepalData).map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District
                    </label>
                    <select
                      required
                      onChange={onChangeHandler}
                      name="city"
                      value={formData.city}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {formData.state ? "Select District" : "Select District (All available)"}
                      </option>
                      {getAvailableDistricts().map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Zipcode and Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zip Code
                    </label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name="zipcode"
                      value={formData.zipcode}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      type="number"
                      placeholder="Enter zip code"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      required
                      onChange={onChangeHandler}
                      name="country"
                      value={formData.country}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      type="text"
                      placeholder="Enter country"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="phone"
                    value={formData.phone}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    type="number"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            {/* --------------------------- RIGHT SIDE - PRODUCT SELECTION & ORDER SUMMARY ------------------------------- */}
            <div className="px-6 py-8 sm:px-8 lg:px-10 bg-gray-50 lg:bg-transparent">
              {/* Product Selection */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-lg font-bold text-gray-900">PRODUCT</h3>
                    <h3 className="text-lg font-bold text-blue-600">SELECTION</h3>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Product Dropdown */}
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Product
                    </label>
                    <select
                      required
                      value={selectedProduct?._id || ""}
                      onChange={(e) => {
                        const product = products.find(p => p._id === e.target.value);
                        handleProductSelect(product);
                      }}
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Choose a product...</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name} - {currency}{product.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Size Selection */}
                  {selectedProduct && (
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Size
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {selectedProduct.sizes?.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            disabled={loading}
                            className={`px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed ${
                              selectedSize === size
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-300 text-gray-700 hover:border-gray-400"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  {selectedProduct && (
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={loading || quantity <= 1}
                          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          disabled={loading}
                          className="w-20 px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          disabled={loading}
                          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {selectedProduct ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Product ({quantity}x)</span>
                        <span className="font-medium">{currency}{(selectedProduct.price * quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-medium">{currency}{delivery_fee.toFixed(2)}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>{currency}{getTotalAmount().toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      Select a product to see order summary
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-lg font-bold text-gray-900">PAYMENT</h3>
                    <h3 className="text-lg font-bold text-blue-600">STATUS</h3>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">Manual Entry</p>
                      <p className="text-sm text-green-600">Order will be marked as completed</p>
                    </div>
                  </div>
                </div>

                {/* Create Order Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={loading || !selectedProduct || !selectedSize}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>CREATING ORDER...</span>
                        </>
                      ) : (
                        <>
                          <span>CREATE ORDER</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOrderManually;