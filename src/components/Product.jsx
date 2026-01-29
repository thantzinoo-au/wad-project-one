import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCarts } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";

export default function Product({ item }) {
  const { itemName, unitPrice, remainingQty } = item;
  const { addToCart, cart } = useCarts();
  const [qty, setQty] = useState(1);

  const isOutOfStock = remainingQty <= 0;
  const inCartQty =
    cart.find((cartItem) => cartItem.itemName === itemName)?.quantity || 0;
  const canAddQty = Math.max(0, remainingQty - inCartQty);

  const handleAdd = () => {
    if (qty <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
    if (qty > canAddQty) {
      alert(
        `Can only add ${canAddQty} more. (${inCartQty} already added, ${remainingQty} available)`,
      );
      return;
    }
    addToCart(item, qty);
    setQty(1);
  };

  return (
    <div className="border rounded-md p-3 bg-card hover:shadow-md transition-shadow flex flex-col gap-2 relative">
      {inCartQty > 0 && !isOutOfStock && (
        <Badge
          variant="default"
          className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full"
        >
          {inCartQty}
        </Badge>
      )}
      <div className="flex justify-between items-start gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <h3 className="font-medium text-sm leading-tight flex-1 truncate cursor-default">
              {itemName}
            </h3>
          </TooltipTrigger>
          <TooltipContent>
            <p>{itemName}</p>
            <p className="text-xs opacity-70">
              {item.category?.replace(/_/g, " ")}
            </p>
          </TooltipContent>
        </Tooltip>
        <span className="font-semibold text-sm whitespace-nowrap">
          {formatCurrency(unitPrice)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {isOutOfStock ? (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
              Out of Stock
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">
              Stock: {remainingQty}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value) || 0)}
            min="1"
            max={canAddQty}
            className="w-14 h-7 text-sm text-center"
            disabled={isOutOfStock}
          />
          <Button
            size="sm"
            onClick={handleAdd}
            className="h-7 px-3"
            disabled={isOutOfStock}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
}
