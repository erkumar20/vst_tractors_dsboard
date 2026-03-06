import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { Toaster } from "./app/components/ui/sonner";
import "./styles/index.css";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
      <Toaster position="top-right" richColors />
    </StrictMode>
  );
}
