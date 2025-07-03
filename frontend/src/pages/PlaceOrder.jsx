import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

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

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
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

const onSubmitHandler = async (event) => {
  event.preventDefault();
  
  try {
    let orderItems = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          const itemInfo = structuredClone(
            products.find((product) => product._id === items)
          );
          if (itemInfo) {
            itemInfo.size = item;
            itemInfo.quantity = cartItems[items][item];
            orderItems.push(itemInfo);
          }
        }
      }
    }

    let orderData = {
      address: formData,
      items: orderItems,
      amount: getCartAmount() + delivery_fee,
    };

    switch (method) {
      case "cod": {
        
        const response = await axios.post(
          backendUrl + '/api/order/place', 
          orderData, 
          { headers: { token } }
        );
        
        console.log("API Response:", response.data); // Add logging
        
        if (response.data.success) {
          toast.success("Order placed successfully!");
          
          // Clear cart items safely
          try {
            setCartItems({});
            console.log("Cart cleared successfully");
          } catch (cartError) {
            console.error("Error clearing cart:", cartError);
            // Don't fail the entire process if cart clearing fails
          }
          
          // Navigate safely
          try {
            navigate('/orders');
          } catch (navError) {
            console.error("Navigation error:", navError);
            // You might want to show a message or handle this differently
            toast.info("Order placed! Please check your orders page.");
          }
        } else {
          toast.error(response.data.message || "Failed to place order");
        }
        break;
      }
      
      default:
        toast.error("Please select a payment method");
        break;
    }
    
  } catch (error) {
    console.error("Order placement error:", error);
    
    // More specific error handling
    if (error.response) {
      // Server responded with error status
      toast.error(error.response.data?.message || "Server error occurred");
    } else if (error.request) {
      // Request was made but no response received
      toast.error("Network error. Please check your connection.");
    } else {
      // Something else happened
      toast.error("An unexpected error occurred");
    }
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form
            onSubmit={onSubmitHandler}
            className="lg:grid lg:grid-cols-2 lg:gap-x-12"
          >
            {/* ------------------ LEFT SIDE - DELIVERY INFORMATION --------------------- */}
            <div className="px-6 py-8 sm:px-8 lg:px-10">
              <div className="mb-8">
                <Title text1={"DELIVERY"} text2={"INFORMATION"} />
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400"
                    type="text"
                    placeholder="Enter street address"
                  />
                </div>

                {/* State and City - Swapped positions */}
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400 bg-white"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400 bg-white"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-gray-400"
                    type="number"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            {/* --------------------------- RIGHT SIDE - ORDER SUMMARY & PAYMENT ------------------------------- */}
            <div className="px-6 py-8 sm:px-8 lg:px-10 bg-gray-50 lg:bg-transparent">
              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <CartTotal />
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <Title text1={"PAYMENT"} text2={"METHOD"} />
                </div>

                <div className="space-y-4">
                  

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setMethod("cod")}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      method === "cod" 
                        ? "border-blue-500 bg-blue-50 shadow-md" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            method === "cod" 
                              ? "border-blue-500 bg-blue-500" 
                              : "border-gray-300"
                          }`}
                        >
                          {method === "cod" && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-gray-700 font-medium">Cash on Delivery</span>
                      </div>
                      <span className="text-sm text-gray-500 font-medium">Pay at doorstep</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-gray-900 to-black text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>PLACE ORDER</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
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

export default PlaceOrder;