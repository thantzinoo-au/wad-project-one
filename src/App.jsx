import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/components/Dashboard";
import Sale from "@/components/Sale";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/sale" />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/sale" element={<Sale />}></Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </TooltipProvider>
  );
}

export default App;
