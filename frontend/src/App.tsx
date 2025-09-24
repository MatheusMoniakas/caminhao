import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Layout from '@/components/Layout';
import Loading from '@/components/Loading';

// Pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Employees from '@/pages/Employees';
import RoutesPage from '@/pages/Routes';
import MyRoutes from '@/pages/MyRoutes';
import Problems from '@/pages/Problems';

// Navigate based on user role
const NavigateToRoleBasedRoute: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  } else if (user?.role === 'employee') {
    return <Navigate to="/my-routes" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  employeeOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false, 
  employeeOnly = false 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading text="Verificando autenticação..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/my-routes" replace />;
  }

  if (employeeOnly && user?.role !== 'employee') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Public Route Component
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading text="Carregando..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute adminOnly>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/employees" 
        element={
          <ProtectedRoute adminOnly>
            <Employees />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/routes" 
        element={
          <ProtectedRoute adminOnly>
            <RoutesPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/problems" 
        element={
          <ProtectedRoute adminOnly>
            <Problems />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/my-routes" 
        element={
          <ProtectedRoute employeeOnly>
            <MyRoutes />
          </ProtectedRoute>
        } 
      />

      {/* Default redirect */}
      <Route path="/" element={<NavigateToRoleBasedRoute />} />
      
      {/* 404 - redirect based on role */}
      <Route path="*" element={<NavigateToRoleBasedRoute />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
