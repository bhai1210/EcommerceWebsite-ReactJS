import TopItemSales from "../Charts/TopItemSales";
import TransactionByHour from "../Charts/TransactionByHour";


export default function EcommerceDashboard() {

  return (
    <main className="dashboard p-6 space-y-8">
    
      <TopItemSales />
      <TransactionByHour  />
    
    </main>
  );
}
