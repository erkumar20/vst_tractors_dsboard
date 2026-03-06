import { createBrowserRouter, Navigate } from "react-router";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Email from "./pages/Email";
import Notification from "./pages/Notification";
import Invoices from "./pages/Invoices";
import AIAssistant from "./pages/AIAssistant";
import Suppliers from "./pages/Suppliers";
import ItemMaster from "./pages/ItemMaster";
import AddSupplier from "./pages/AddSupplier";
import AddItem from "./pages/AddItem";
import BOMMaster from "./pages/BOMMaster";
import AddBOM from "./pages/AddBOM";
import PriceMaster from "./pages/PriceMaster";
import DataStorage from "./pages/DataStorage";
import ErrorPage from "./pages/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "data-storage",
        element: <DataStorage />
      },
      {
        path: "email",
        element: <Email />
      },
      {
        path: "notification",
        element: <Notification />
      },
      {
        path: "invoices",
        element: <Invoices />
      },
      {
        path: "ai-assistant",
        element: <AIAssistant />
      },
      {
        path: "suppliers",
        children: [
          {
            index: true,
            element: <Suppliers />
          },
          {
            path: "add",
            element: <AddSupplier />
          }
        ]
      },
      {
        path: "item-master",
        children: [
          {
            index: true,
            element: <ItemMaster />
          },
          {
            path: "add",
            element: <AddItem />
          }
        ]
      },
      {
        path: "add-supplier",
        element: <AddSupplier />
      },
      {
        path: "add-item",
        element: <AddItem />
      },
      {
        path: "bom-master",
        element: <BOMMaster />
      },
      {
        path: "add-bom",
        element: <AddBOM />
      },
      {
        path: "price-master",
        element: <PriceMaster />
      },
      {
        path: "404",
        element: <ErrorPage />
      },
      {
        path: "*",
        element: <Navigate to="/404" replace />
      }
    ],
  },
]);