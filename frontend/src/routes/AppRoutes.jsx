import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Imports de Contexto e Componentes Globais
import { AuthContext, AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";

// Imports das Páginas
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Carrinho from "../pages/Carrinho";
import Pedidos from "../pages/Pedidos";
import RegisterVendedor from "../pages/RegisterVendedor";
import DashboardVendedor from "../pages/DashboardVendedor";
import NovoProduto from "../pages/NovoProduto"; 
import ProdutoDetalhe from "../pages/ProdutoDetalhe";

import PrivateRoute from "../components/PrivateRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        
        {/* Navbar global */}
        <Navbar />

        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/produto/:id" element={<ProdutoDetalhe />} />

          {/* Rotas de Visitantes (Corrigido para usar RotaVisitante) */}
          <Route path="/login" element={<RotaVisitante><Login /></RotaVisitante>} />
          <Route path="/register" element={<RotaVisitante><Register /></RotaVisitante>} />
          <Route path="/register-vendedor" element={<RotaVisitante><RegisterVendedor /></RotaVisitante>} />

          {/* Rotas Privadas (Geral / Clientes) */}
          <Route
            path="/carrinho"
            element={
              <PrivateRoute>
                <Carrinho />
              </PrivateRoute>
            }
          />
          <Route
            path="/pedidos"
            element={
              <PrivateRoute>
                <Pedidos />
              </PrivateRoute>
            }
          />

          {/* Rotas Exclusivas para Vendedores */}
          <Route 
            path="/dashboard-vendedor" 
            element={
              <RotaVendedor>
                <DashboardVendedor />
              </RotaVendedor>
            } 
          />
          <Route 
            path="/novo-produto" 
            element={
              <RotaVendedor>
                <NovoProduto />
              </RotaVendedor>
            } 
          />

          {/* Rota de Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}

export function RotaVisitante({ children }) {
  const { token, loading } = useContext(AuthContext);
  
  if (loading) return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export function RotaVendedor({ children }) {
  const { token, user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center text-slate-500 font-medium">Verificando permissões...</div>;
  }
  
  if (!token || user?.tipo !== "vendedor") {
    return <Navigate to="/" replace />;
  }
  return children;
}