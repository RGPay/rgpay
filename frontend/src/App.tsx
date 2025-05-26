import React, { ReactElement } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import About from "./pages/About";
import Login from "./pages/Login";
import { ProdutosListPage, ProdutoFormPage } from "./pages/produtos";
import { PedidosListPage, PedidoDetailsPage } from "./pages/pedidos";
import { UnidadesListPage, UnidadeFormPage } from "./pages/unidades";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
import { MainLayout } from "./components/Layout";
import EventsListPage from "./pages/events/EventsListPage";
import EventsFormPage from "./pages/events/EventsFormPage";
import { CategoriesListPage, CategoriesFormPage } from "./pages/categories";
import RelatoriosPage from "./pages/RelatoriosPage";

// Protected Layout component that checks authentication and applies the MainLayout
function ProtectedLayout() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

// Placeholder components for routes that don't have dedicated pages yet
const ProfilePage = () => <div>Perfil em construção</div>;

// Check if user is already logged in and redirect accordingly
function PublicRoute({ children }: { children: ReactElement }) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected routes with layout */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<About />} />

          {/* Products routes */}
          <Route path="/produtos">
            <Route index element={<ProdutosListPage />} />
            <Route path="novo" element={<ProdutoFormPage />} />
            <Route path="editar/:id" element={<ProdutoFormPage />} />
          </Route>

          {/* Orders routes */}
          <Route path="/pedidos">
            <Route index element={<PedidosListPage />} />
            <Route path="detalhes/:id" element={<PedidoDetailsPage />} />
          </Route>

          {/* Units routes */}
          <Route path="/unidades">
            <Route index element={<UnidadesListPage />} />
            <Route path="nova" element={<UnidadeFormPage />} />
            <Route path="editar/:id" element={<UnidadeFormPage />} />
          </Route>

          {/* Events routes */}
          <Route path="/eventos">
            <Route index element={<EventsListPage />} />
            <Route path="novo" element={<EventsFormPage />} />
            <Route path="editar/:id" element={<EventsFormPage />} />
          </Route>

          {/* Categories routes */}
          <Route path="/categories">
            <Route index element={<CategoriesListPage />} />
            <Route path="new" element={<CategoriesFormPage />} />
            <Route path=":id/edit" element={<CategoriesFormPage />} />
          </Route>

          {/* Profile route */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Relatórios route */}
          <Route path="/relatorios" element={<RelatoriosPage />} />
        </Route>

        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
