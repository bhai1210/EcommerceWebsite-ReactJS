import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface Address {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface CartItem {
  _id: string;
  name: string;
  price: number;
  qty: number;
  description?: string;
}

interface User {
  _id: string;
  email: string;
  role: string;
}

interface Order {
  _id: string;
  submittedAddress: Address;
  cart: CartItem[];
  cartTotal: number;
  shippingCharge: number;
  finalTotal: number;
  user: User;
  createdAt: string;
}

function ViewOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <motion.p
        className="text-center mt-5 text-[#0d3b66] font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading orders...
      </motion.p>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.p
        className="text-center mt-5 text-gray-600 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        No orders found.
      </motion.p>
    );
  }

  return (
    <div className="p-6">
      <motion.h2
        className="text-3xl font-bold mb-6 text-center text-[#0d3b66]"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Orders
      </motion.h2>

      <motion.table
        className="w-full border-collapse shadow-2xl rounded-xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <thead className="bg-[#0d3b66] text-white">
          <tr>
            <th className="p-3 text-left">User Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Address</th>
            <th className="p-3 text-left">Cart Items</th>
            <th className="p-3 text-left">Cart Total</th>
            <th className="p-3 text-left">Shipping</th>
            <th className="p-3 text-left">Final Total</th>
            <th className="p-3 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <motion.tr
              key={order._id}
              className="hover:bg-[#0d3b66]/10 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <td className="p-3 border-b">{order.user?.email}</td>
              <td className="p-3 border-b">{order.user?.role}</td>
              <td className="p-3 border-b">
                {order.submittedAddress.address}, {order.submittedAddress.city},{" "}
                {order.submittedAddress.state}, {order.submittedAddress.zip},{" "}
                {order.submittedAddress.country}
              </td>
              <td className="p-3 border-b">
                {order.cart.map((item) => (
                  <div key={item._id} className="text-sm">
                    {item.name} (x{item.qty}) – ₹{item.price}
                  </div>
                ))}
              </td>
              <td className="p-3 border-b font-semibold text-gray-700">
                ₹{order.cartTotal}
              </td>
              <td className="p-3 border-b">₹{order.shippingCharge}</td>
              <td className="p-3 border-b font-bold text-[#0d3b66]">
                ₹{order.finalTotal}
              </td>
              <td className="p-3 border-b text-gray-600">
                {new Date(order.createdAt).toLocaleString()}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
}

export default ViewOrder;
