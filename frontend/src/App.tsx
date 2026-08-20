import { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate, HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { ApiStatusBar } from "./components/ui/ApiStatusBar";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  );
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route
      path="/login"
      element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      }
    />
    <Route
      path="/register"
      element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      }
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const ThemedToaster = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "10px",
          background: isDark ? "#111827" : "#1f2937",
          color: "#f9fafb",
          border: isDark ? "1px solid #374151" : "none",
          fontSize: "14px",
        },
      }}
    />
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <ThemeProvider>
          <AuthProvider>
            <ApiStatusBar />
            <AppRoutes />
            <ThemedToaster />
          </AuthProvider>
        </ThemeProvider>
      </HashRouter>
    </QueryClientProvider>
  );
}
