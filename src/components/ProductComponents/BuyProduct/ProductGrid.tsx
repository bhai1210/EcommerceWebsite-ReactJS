import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  products: any[];
  loading: boolean;
  cart: any[];
  onAddToCart: (product: any) => void;
}

export default function ProductGrid({
  products,
  loading,
  cart,
  onAddToCart,
}: ProductGridProps) {
  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-2xl overflow-hidden shadow-md bg-gray-200 animate-pulse h-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((item, index) => {
        const isInCart = cart.some((c) => c._id === item._id);

        return (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-white">
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <motion.img
                  src={item.image || "https://via.placeholder.com/300"}
                  alt={item.name}
                  className="h-56 w-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
                <AnimatePresence>
                  {isInCart && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md"
                    >
                      ✅ In Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col justify-between h-[220px]">
                <div>
                  <h3 className="text-gray-900 font-semibold text-lg truncate">
                    {item.name}
                  </h3>
                  <p className="text-[#0d3b66] font-bold text-xl mt-1">
                    ₹ {item.price}
                  </p>
                  <p className="text-gray-500 mt-2 text-sm line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Add to Cart Button */}
                {!isInCart && (
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="mt-4"
                  >
                    <Button
                      className="w-full bg-[#0d3b66] hover:bg-blue-700 text-white rounded-lg shadow-md relative overflow-hidden"
                      onClick={() => onAddToCart(item)}
                    >
                      🛒 Add to Cart
                    </Button>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
