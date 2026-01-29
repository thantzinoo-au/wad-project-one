import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCarts } from "@/contexts/CartContext";
import { getRemainingInventory } from "@/lib/analyticsHelpers";
import all_items from "@/assets/pos_item.json";
import ProductList from "@/components/ProductList";
import SaleDetail from "@/components/SaleDetail";

export default function Sale() {
  const navigate = useNavigate();
  const { sale } = useCarts();

  const remainingInventory = useMemo(() => {
    return getRemainingInventory(all_items, sale);
  }, [sale]);

  const itemsWithRemainingInventory = useMemo(() => {
    return all_items.map((item) => ({
      ...item,
      remainingQty: remainingInventory[item.itemName] ?? item.inventory,
    }));
  }, [remainingInventory]);

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Sales Journal</h1>
        <Button onClick={() => navigate("/dashboard")} variant="outline">
          Dashboard
        </Button>
      </div>
      <div className="flex gap-4 p-4 flex-1 overflow-hidden">
        <ProductList items={itemsWithRemainingInventory} />
        <SaleDetail />
      </div>
    </div>
  );
}
