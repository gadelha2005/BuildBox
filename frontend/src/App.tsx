import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/client/HomePage";
import { ProductListPage } from "./pages/client/ProductListPage";
import { ProductDetailPage } from "./pages/client/ProductDetailPage";
import { CartPage } from "./pages/client/CartPage";
import { CheckoutPage } from "./pages/client/CheckoutPage";
import { OrderHistoryPage } from "./pages/client/OrderHistoryPage";
import { OrderDetailPage } from "./pages/client/OrderDetailPage";
import { LoginPage } from "./pages/client/LoginPage";
import { RegisterPage } from "./pages/client/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/entrar" element={<LoginPage />} />
            <Route path="/cadastrar" element={<RegisterPage />} />

            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/produtos"
              element={
                <Layout>
                  <ProductListPage />
                </Layout>
              }
            />
            <Route
              path="/produtos/:id"
              element={
                <Layout>
                  <ProductDetailPage />
                </Layout>
              }
            />

            <Route
              path="/carrinho"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CartPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CheckoutPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pedidos"
              element={
                <ProtectedRoute>
                  <Layout>
                    <OrderHistoryPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pedidos/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <OrderDetailPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
