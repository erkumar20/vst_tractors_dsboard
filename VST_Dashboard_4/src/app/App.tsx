import { RouterProvider } from "react-router";
import { router } from "./routes";
import Login from "./pages/Login";
import { CategoryProvider } from "./context/CategoryContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { AppDataProvider } from "./context/AppDataContext";

function AppContent() {
  const { isAuthenticated, login } = useAuth();

  const handleLoginSuccess = () => {
    // Force navigation to dashboard on login
    window.history.replaceState(null, "", "/");
    login();
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <CategoryProvider>
      <AppDataProvider>
        <DataProvider>
          <RouterProvider router={router} />
        </DataProvider>
      </AppDataProvider>
    </CategoryProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}