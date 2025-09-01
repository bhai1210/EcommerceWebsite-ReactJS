import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { UseTransactionByhourdata } from "@/Services/hooks/usetransactionbyhour";

export default function TransactionByHour() {
  const { data: heatmap, isLoading, isError } = UseTransactionByhourdata();

  if (isLoading)
    return <div className="text-center py-10 text-gray-400">Loading...</div>;
  if (isError || !heatmap)
    return <div className="text-center py-10 text-red-500">Error loading data.</div>;

  const maxValue = Math.max(...heatmap.data.flat());

  const getColor = (value: number) => {
    const intensity = value / maxValue;
    const start = [230, 240, 255]; // light blue
    const end = [30, 90, 210]; // deep blue
    const r = Math.round(start[0] + (end[0] - start[0]) * intensity);
    const g = Math.round(start[1] + (end[1] - start[1]) * intensity);
    const b = Math.round(start[2] + (end[2] - start[2]) * intensity);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <Card className="w-full max-w-6xl mx-auto mt-6 sm:mt-10 p-4 sm:p-6 shadow-2xl rounded-3xl bg-white/90 backdrop-blur-md hover:shadow-3xl transition-shadow duration-500">
      <CardHeader>
        <CardTitle className="text-lg sm:text-2xl font-bold text-blue-600 tracking-wide text-center sm:text-left">
          Transactions by Hour
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[600px] sm:min-w-0 grid grid-cols-[80px_repeat(7,_1fr)] sm:grid-cols-[120px_repeat(7,_1fr)] gap-1.5 sm:gap-2">
            {/* Header Days */}
            <div></div>
            {heatmap.days.map((day, idx) => (
              <motion.div
                key={day}
                className="text-center text-xs sm:text-sm font-semibold text-gray-500"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
              >
                {day}
              </motion.div>
            ))}

            {/* Rows */}
            {heatmap.data.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {/* Time Slot */}
                <motion.div
                  className="text-right pr-1 sm:pr-2 text-xs sm:text-sm font-medium text-gray-700"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: rowIndex * 0.05, duration: 0.4 }}
                >
                  {heatmap.timeSlots[rowIndex]}
                </motion.div>

                {/* Heatmap cells */}
                {row.map((value, colIndex) => {
                  const intensity = value / maxValue;
                  return (
                    <motion.div
                      key={colIndex}
                      className="rounded-md text-center text-xs sm:text-sm py-1.5 sm:py-2 font-semibold cursor-pointer shadow-inner hover:shadow-lg transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: getColor(value),
                        color: intensity > 0.5 ? "#fff" : "#222",
                      }}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: rowIndex * 0.07 + colIndex * 0.03,
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                    >
                      {value}
                    </motion.div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
