import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  categories: { _id: string; name: string }[];
  cartCount: number;
  onCartClick: () => void;
}

export default function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  categories,
  cartCount,
  onCartClick,
}: Props) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [showClearMsg, setShowClearMsg] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue, setSearchQuery]);

  const handleClearFilters = () => {
    setInputValue("");
    setSearchQuery("");
    setCategory("");
    setShowClearMsg(true);

    setTimeout(() => {
      setShowClearMsg(false);
    }, 1500);
  };

  return (
    <div className="relative flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      {/* Search Box */}
      <motion.input
        type="text"
        placeholder="Search for products..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0d3b66] shadow-sm"
        whileFocus={{ scale: 1.03, boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }}
        transition={{ duration: 0.3 }}
      />

      {/* Category Filter */}
      <motion.select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0d3b66] shadow-sm"
        whileHover={{ scale: 1.05, boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}
        transition={{ duration: 0.3 }}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </motion.select>

      {/* Clear Filters Button */}
      <motion.button
        onClick={handleClearFilters}
        className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md relative overflow-hidden"
        whileHover={{ scale: 1.1, rotate: 3 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        ❌ Clear Filters
      </motion.button>

      {/* Floating "Filtering Cleared!" message */}
      <AnimatePresence>
        {showClearMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: -25, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-lg shadow-lg font-semibold text-sm"
          >
            Filters Cleared!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Button */}
      <motion.button
        onClick={onCartClick}
        className="relative bg-[#0d3b66] text-white px-5 py-2 rounded-lg shadow-md font-semibold"
        whileHover={{ scale: 1.05, boxShadow: "0 5px 20px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        🛒 Cart
        <AnimatePresence>
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2"
            >
              {cartCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
