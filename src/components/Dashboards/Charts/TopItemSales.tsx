
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTopSales } from "@/Services/hooks/useTopSales";

export default function TopItemSales() {
  const { data: sales = [], isLoading, isError } = useTopSales();

  if (isLoading)
    return <div className="text-center py-10 text-gray-400">Loading...</div>;
  if (isError)
    return <div className="text-center py-10 text-red-500">Failed to load sales data.</div>;

  const maxValue = Math.max(...sales.map((item) => item.value), 100);

  return (
    <Card className="w-full max-w-6xl mx-auto mt-6 sm:mt-10 p-4 sm:p-8 shadow-2xl rounded-3xl bg-white/90 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-lg sm:text-2xl font-bold text-purple-600 tracking-wide text-center sm:text-left">
          Top Items by Sales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 sm:space-y-6">
          {sales.map((item, index) => {
            const widthPercent = (item.value / maxValue) * 100;

            return (
              <motion.div
                key={item.name}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 group"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                {/* Item Name */}
                <span className="text-gray-700 font-semibold text-sm sm:text-base w-full sm:w-32 text-center sm:text-left group-hover:text-purple-600 transition-colors duration-300">
                  {item.name}
                </span>

                {/* Bar */}
                <div className="flex-1 h-4 sm:h-6 bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full shadow-md"
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                  {/* Glow effect */}
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-full bg-purple-300 opacity-30 blur-xl"
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>

                {/* Value */}
                <span className="text-gray-800 font-medium text-sm sm:text-base w-full sm:w-16 text-center sm:text-right group-hover:text-purple-600 transition-colors duration-300">
                  {item.value}
                </span>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
