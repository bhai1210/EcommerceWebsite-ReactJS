
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  products: any[];
  loading: boolean;
  cart: any[];
  onAddToCart: (product: any) => void;
}

export default function ProductGrid({ products, loading, cart, onAddToCart }: ProductGridProps) {
  if (loading)
    return (
      <p className="text-center text-lg mt-20 font-medium text-gray-500">
        Loading products...
      </p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((item, index) => {
        const isInCart = cart.some((c) => c._id === item._id);

        return (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={{ scale: 1.03 }}
          >
            <Card className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <img
                  src={item.image || "https://via.placeholder.com/300"}
                  alt={item.name}
                  className="h-56 w-full object-cover"
                />
                {isInCart && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    In Cart
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col justify-between h-[200px]">
                <div>
                  <h3 className="text-gray-900 font-semibold text-lg truncate">
                    {item.name}
                  </h3>
                  <p className="text-[#0d3b66]  font-bold text-xl mt-1">₹ {item.price}</p>
                  <p className="text-gray-500 mt-2 text-sm line-clamp-3">
                    {item.description}
                  </p>
                </div>
                {!isInCart && (
                  <Button
                    className="mt-4 w-full bg-[#0d3b66] text-white hover:bg-blue-700 text-white rounded-lg shadow-sm"
                    onClick={() => onAddToCart(item)}
                  >
                    🛒 Add to Cart
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
