import { useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import { STORAGE_KEY } from "@/lib/constants";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : {};
    return parsed.cart || [];
  });
  const [sale, setSale] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : {};
    return parsed.sales || [];
  });

  useEffect(() => {
    const settings = { cart, sales: sale };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [cart, sale]);

  const addToCart = (newItem, quantity) => {
    const existingItem = cart.find(
      (item) => item.itemName === newItem.itemName,
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.itemName === newItem.itemName
            ? {
                ...item,
                quantity: item.quantity + quantity,
                amount: (item.quantity + quantity) * item.unitPrice,
              }
            : item,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          ...newItem,
          quantity,
          amount: quantity * newItem.unitPrice,
        },
      ]);
    }
  };

  const checkout = (saleDate) => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const timestamp = saleDate
      ? new Date(saleDate).toISOString()
      : new Date().toISOString();

    const newSale = {
      id: Date.now(),
      items: cart,
      total: cart.reduce((sum, item) => sum + item.amount, 0),
      timestamp,
    };

    setSale([...sale, newSale]);
    setCart([]);
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = { cart, sale, addToCart, checkout, setSale, clearCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
