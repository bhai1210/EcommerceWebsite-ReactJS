import React, { forwardRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-toastify";
import axios from "axios";
interface Props {
  cart: any[];
  step: number;
  setStep: (val: number) => void;
  checkout: any;
  cartTotal: number;
  shippingCharge: number;
  finalTotal: number;
  onRemoveFromCart: (id: string) => void;
  onClose: () => void;
  dispatch: any;
}

const CartSidebar = forwardRef<HTMLDivElement, Props>(
  (
    {
      cart,
      step,
      setStep,
      checkout,
      cartTotal,
      shippingCharge,
      finalTotal,
      onRemoveFromCart,
      onClose,
      dispatch,
    },
    ref
  ) => {
  const handleAddressSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const addressData = {
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    zip: formData.get("zip"),
    country: formData.get("country"),
  };
  console.log("Submitted Address:", addressData);

  console.log("Cart:", cart);
console.log("Checkout:", checkout);
console.log("Cart Total:", cartTotal);
console.log("Shipping Charge:", shippingCharge);
console.log("Final Total:", finalTotal);


  dispatch({ type: "checkout/setAddress", payload: addressData });
  setStep(3);
};


// const handlePayment = async () => {
//   if (!checkout.address) {
//     return toast.error("Please enter shipping address!");
//   }

//   try {
//     // Get user from localStorage
//     const storedUser = localStorage.getItem("user");
//     const user = storedUser ? JSON.parse(storedUser) : null;

//     if (!user?._id) {
//       return toast.error("User not found, please login!");
//     }

//     // Build order payload
//     const orderData = {
//       submittedAddress: checkout, // Address user submitted
//       cart: cart,                 // Cart items
//       checkout: checkout,         // Optional checkout object
//       cartTotal: cartTotal,
//       shippingCharge: shippingCharge,
//       finalTotal: finalTotal,
//       user: {
//         _id: user._id,
//         email: user.email,
//         role: user.role,
//       },
//     };

//     // Call backend API
//     const res = await axios.post("http://localhost:5000/orders", orderData);

//     toast.success("🎉 Payment Success! (Demo)");
//     console.log("Order saved:", res.data);

//     // Clear cart/checkout after saving
//     dispatch({ type: "cart/clearCart" });
//     dispatch({ type: "checkout/clearCheckout" });
//     onClose();
//     setStep(1);
//   } catch (err: any) {
//     console.error("Payment error:", err);
//     toast.error(err.response?.data?.message || "Payment failed");
//   }
// };



const handlePayment = async () => {
  if (!checkout.address) {
    return toast.error("Please enter shipping address!");
  }

  try {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user?._id) {
      return toast.error("User not found, please login!");
    }

    // Build order payload
    const orderData = {
      submittedAddress: checkout,
      cart: cart,
      checkout: checkout,
      cartTotal: cartTotal,
      shippingCharge: shippingCharge,
      finalTotal: finalTotal,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    };

    // 1️⃣ Request Razorpay order from backend
    const { data: order } = await axios.post(
      "http://localhost:5000/payments/create-order",
      { amount: finalTotal * 100 } // amount in paise
    );

    // 2️⃣ Open Razorpay checkout
    const options = {
      key: "rzp_live_R9XuwBFRtEokgL", // replace with your key
      amount: order.amount,
      currency: order.currency,
      name: "My Shop",
      description: "Test Transaction",
      order_id: order.id,
      handler: async function (response: any) {
        try {
          // 3️⃣ Verify payment on backend
          const verifyRes = await axios.post(
            "http://localhost:5000/payments/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (verifyRes.data.success) {
            // 4️⃣ Save order in DB (your original code kept intact)
            const res = await axios.post(
              "http://localhost:5000/api/orders",
              orderData
            );

            toast.success("🎉 Payment Success!");
            console.log("Order saved:", res.data);

            dispatch({ type: "cart/clearCart" });
            dispatch({ type: "checkout/clearCheckout" });
            onClose();
            setStep(1);
          } else {
            toast.error("Payment verification failed!");
          }
        } catch (err: any) {
          console.error("Verification error:", err);
          toast.error("Payment failed!");
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (err: any) {
    console.error("Payment error:", err);
    toast.error(err.response?.data?.message || "Payment failed");
  }
};


    return (
      <motion.div
        ref={ref}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-white shadow-2xl z-50 flex flex-col p-6 overflow-y-auto"
      >
        <AnimatePresence mode="wait">
          {/* Step 1: Cart */}
          {step === 1 && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4">🛒 Your Cart</h2>
              {cart.length === 0 ? (
                <p className="text-gray-500">Cart is empty</p>
              ) : (
                <ul className="space-y-3">
                  {cart.map((item) => (
                    <motion.li
                      key={item._id}
                      whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                      className="flex justify-between items-center border-b pb-2 rounded-md p-2"
                    >
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          ₹ {item.price} × {item.qty}
                        </p>
                      </div>
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onRemoveFromCart(item._id)}
                        >
                          Remove
                        </Button>
                      </motion.div>
                    </motion.li>
                  ))}
                </ul>
              )}
              <p className="mt-4 font-bold">Total: ₹ {cartTotal}</p>
              {cart.length > 0 && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="mt-4"
                >
                  <Button
                    className="w-full bg-[#0d3b66] hover:bg-blue-700 text-white animate-pulse"
                    onClick={() => setStep(2)}
                  >
                    Proceed to Checkout →
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <motion.form
              key="address"
              onSubmit={handleAddressSubmit}
              className="space-y-3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4">📦 Shipping Address</h2>
              <Input name="address" placeholder="Address" required />
              <Input name="city" placeholder="City" required />
              <Input name="state" placeholder="State" required />
              <Input name="zip" placeholder="ZIP Code" required />
              <Input name="country" placeholder="Country" required />
              <Button
                type="submit"
                className="w-full bg-[#0d3b66] hover:bg-blue-700 text-white"
              >
                Continue →
              </Button>
            </motion.form>
          )}

          {/* Step 3: Shipping */}
          {step === 3 && (
            <motion.div
              key="shipping"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4">🚚 Shipping Method</h2>
              <RadioGroup
                defaultValue="standard"
                onValueChange={(val) =>
                  dispatch({ type: "checkout/setShippingMethod", payload: val })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <label htmlFor="standard">Standard (Free)</label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="express" id="express" />
                  <label htmlFor="express">Express (₹50)</label>
                </div>
              </RadioGroup>
              <Button
                className="w-full mt-4 bg-[#0d3b66] hover:bg-blue-700 text-white"
                onClick={() => setStep(4)}
              >
                Continue →
              </Button>
            </motion.div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4">💳 Payment</h2>
              <p>Cart Total: ₹ {cartTotal}</p>
              <p>Shipping: ₹ {shippingCharge}</p>
              <p className="font-bold mb-4">Final Total: ₹ {finalTotal}</p>
              <Button
                className="w-full bg-[#0d3b66] hover:bg-green-700 text-white"
                onClick={handlePayment}
              >
                ✅ Pay Now
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

export default CartSidebar;
