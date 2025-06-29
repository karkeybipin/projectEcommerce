
// import { response } from "express";
// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";

// // Placing order using cash on delivery
// const placeOrder = async (req, res) => {
//   try {
//     const { userId, items, amount, address } = req.body;

//     const orderData = {
//       userId,
//       items,
//       address,
//       amount,
//       paymentMethod: "COD",
//       payment: false,
//       date: Date.now(),
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();

//     // Only clear cart if userId is provided (for regular user orders)
//     if (userId) {
//       await userModel.findByIdAndUpdate(userId, { cartData: {} });
//     }

//     res.json({ success: true, message: "Order Placed" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // Admin function for placing order manually
// const placeOrderManually = async (req, res) => {
//   try {
//     const { items, amount, address } = req.body;

//     const orderData = {
//       userId: "admin", // Set as admin or create a special identifier
//       items,
//       address,
//       amount,
//       paymentMethod: "Manual Entry",
//       payment: false,
//       date: Date.now(),
//       status: "Order Placed",
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();

//     res.json({ success: true, message: "Order Added Manually" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };



// // All orders data for Admin Panel
// const allOrders = async (req, res) => {
//   try {
//     const orders = await orderModel.find({});
//     res.json({ success: true, orders });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // User order data for frontend
// const userOrders = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     const orders = await orderModel.find({ userId });
//     res.json({ success: true, orders });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // update order status
// const updateStatus = async (req, res) => {
//   try {
//     const { orderId, status } = req.body;
//     await orderModel.findByIdAndUpdate(orderId, { status });
//     res.json({ success: true, message: "Order Status Updated" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// export {
//   placeOrder,
//   placeOrderManually,
//   allOrders,
//   userOrders,
//   updateStatus,
// };


import { response } from "express";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Placing order using cash on delivery
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      initiator: "user", // Regular user order
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Only clear cart if userId is provided (for regular user orders)
    if (userId) {
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
    }

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Admin function for placing order manually
const placeOrderManually = async (req, res) => {
  try {
    const { items, amount, address, paymentMethod } = req.body;

    const orderData = {
      userId: `manual_order_${Date.now()}`, // Generate unique ID for manual orders
      items,
      address,
      amount,
      paymentMethod: paymentMethod || "Manual Entry",
      payment: true, // Mark as paid for admin orders
      date: Date.now(),
      status: "Done", // Set status as "Done" for admin orders
      initiator: "admin", // Mark as admin initiated
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    res.json({ success: true, message: "Order Added Manually" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// All orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User order data for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderManually,
  allOrders,
  userOrders,
  updateStatus,
};