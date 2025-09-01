import React, { useState, useEffect } from "react";

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

  // Debounce effect for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [inputValue, setSearchQuery]);

  // Reset filters function
  const handleClearFilters = () => {
    setInputValue("");
    setSearchQuery("");
    setCategory("");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
      {/* Search Box */}
      <input
        type="text"
        placeholder="Search for products..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-1 border border-gray-300 rounded px-3 py-2"
      />

      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Remove Filters Button */}
      <button
        onClick={handleClearFilters}
        className="bg-gray-500 text-white px-4 py-2 rounded"
      >
        ❌ Remove Filters
      </button>

      {/* Cart Button */}
      <button
        onClick={onCartClick}
        className="relative bg-[#0d3b66] text-white px-4 py-2 rounded"
      >
        🛒 Cart
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}
