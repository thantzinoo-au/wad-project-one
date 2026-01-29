import { useState } from "react";
import { toast } from "sonner";
import { useCarts } from "@/contexts/CartContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

export default function SaleDetail() {
  const { cart, checkout, clearCart } = useCarts();
  const [saleDate, setSaleDate] = useState(getTodayDate);
  const total = cart.reduce((sum, item) => sum + item.amount, 0);

  const handleRecordSale = () => {
    const itemCount = cart.length;
    checkout(saleDate);
    setSaleDate(getTodayDate());
    toast.success("Sale recorded successfully!", {
      description: `${itemCount} item${itemCount > 1 ? "s" : ""} totaling ${formatCurrency(total)}`,
      closeButton: true,
    });
  };

  return (
    <div className="w-80 min-h-0 flex flex-col h-full rounded-md border bg-card">
      <div className="p-3 border-b shrink-0 flex items-center justify-between">
        <h2 className="font-semibold">Current Sale</h2>
        {cart.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-destructive hover:text-destructive"
              >
                Clear
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear cart?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all {cart.length} item
                  {cart.length > 1 ? "s" : ""} from the current sale. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={clearCart}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <ScrollArea className="flex-1 min-h-0">
        {cart.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No items added
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left w-[140px]">Item</TableHead>
                <TableHead className="text-center w-12">Qty</TableHead>
                <TableHead className="text-right w-20">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-sm py-2 max-w-[140px]">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="truncate cursor-default">
                          {item.itemName}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.itemName}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center text-sm py-2 w-12">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-right text-sm py-2 w-20 whitespace-nowrap">
                    {formatCurrency(item.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </ScrollArea>
      <div className="border-t p-3 space-y-3 shrink-0">
        <div className="space-y-1">
          <Label htmlFor="sale-date" className="text-xs text-muted-foreground">
            Sale Date
          </Label>
          <Input
            id="sale-date"
            type="date"
            value={saleDate}
            onChange={(e) => setSaleDate(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <Button
          onClick={handleRecordSale}
          disabled={cart.length === 0}
          className="w-full"
          size="lg"
        >
          Record Sale
        </Button>
      </div>
    </div>
  );
}
