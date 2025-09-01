import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fetchProducts } from "../../../Features/productSlice";
import { addToCart, removeFromCart } from "../../../Features/cartSlice";
import { setAddress, setShippingMethod, clearCheckout, clearCheckout as clearCheckoutSlice } from "../../../Features/checkoutSlice";
import api from "@/Services/api/api";

import SearchFilterBar from "./SearchFilterBar";
import ProductGrid from "./ProductGrid";
import CartSidebar from "./CartSidebar";

export default function PurchaseItem() {
  const dispatch = useDispatch();
  const { items: cart } = useSelector((state: any) => state.cart);
  const { items: products, loading } = useSelector((state: any) => state.products);
  const checkout = useSelector((state: any) => state.checkout);

  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [step, setStep] = useState(1);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const cartTotal = cart?.reduce((sum: number, item: any) => sum + item.price * item.qty, 0) || 0;
  const shippingCharge = checkout.shippingMethod === "express" ? 50 : 0;
  const finalTotal = cartTotal + shippingCharge;

  // Fetch products
  useEffect(() => {
    dispatch(fetchProducts({ search: searchQuery, category }) as any);
  }, [searchQuery, category, dispatch]);

  // Fetch categories
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/categories");
        setCategories(Array.isArray(res.data.data) ? res.data.data : []);
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
        setStep(1);
      }
    };
    if (sidebarOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  const handleAddToCart = (product: any) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart`);
  };

  const handleRemoveFromCart = (id: string) => {
    dispatch(removeFromCart(id));
    toast.info("Item removed from cart");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-5 relative">
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        category={category}
        setCategory={setCategory}
        categories={categories}
        cartCount={cart.length}
        onCartClick={() => setSidebarOpen(true)}
      />

      <ProductGrid
        products={products}
        loading={loading}
        cart={cart}
        onAddToCart={handleAddToCart}
      />

      <AnimatePresence>
        {sidebarOpen && (
          <CartSidebar
            ref={sidebarRef}
            cart={cart}
            step={step}
            setStep={setStep}
            checkout={checkout}
            cartTotal={cartTotal}
            shippingCharge={shippingCharge}
            finalTotal={finalTotal}
            onRemoveFromCart={handleRemoveFromCart}
            onClose={() => setSidebarOpen(false)}
            dispatch={dispatch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
