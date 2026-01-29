import { createContext, useContext } from "react";

export const CartContext = createContext();

export function useCarts() {
  return useContext(CartContext);
}
