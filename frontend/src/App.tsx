import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/client/Home/HomePage";
import { ProductListPage } from "./pages/client/ProductList/ProductListPage";
import { ProductDetailPage } from "./pages/client/ProductDetail/ProductDetailPage";
import { CartPage } from "./pages/client/Cart/CartPage";
import { CheckoutPage } from "./pages/client/Checkout/CheckoutPage";
import { OrderHistoryPage } from "./pages/client/OrderHistory/OrderHistoryPage";
import { OrderDetailPage } from "./pages/client/OrderDetail/OrderDetailPage";
import { LoginPage } from "./pages/client/Login/LoginPage";
import { RegisterPage } from "./pages/client/Register/RegisterPage";
import { StaffLayout } from "./components/staffLayout/StaffLayout";
import { StockPage } from "./pages/staff/stockPage/StockPage";
import { OrdersPage } from "./pages/staff/ordersPage/ordersPage"; 


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

            <Route
              path="/painel-funcionario"
              element={
                <ProtectedRoute roles={["FUNCIONARIO", "ADMIN"]}>
                  <StaffLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="estoque" replace />} />
              <Route path="estoque" element={<StockPage />} />
              <Route path="pedidos" element={<OrdersPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
