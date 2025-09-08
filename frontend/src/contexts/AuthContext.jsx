import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se há um token salvo no localStorage
    const token = localStorage.getItem('@GestaoRotas:token');
    const savedUser = localStorage.getItem('@GestaoRotas:user');
    const savedCompany = localStorage.getItem('@GestaoRotas:company');

    if (token && savedUser && savedCompany) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      setUser(JSON.parse(savedUser));
      setCompany(JSON.parse(savedCompany));
    }

    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user: userData, company: companyData } = response.data;

      // Salva no localStorage
      localStorage.setItem('@GestaoRotas:token', token);
      localStorage.setItem('@GestaoRotas:user', JSON.stringify(userData));
      localStorage.setItem('@GestaoRotas:company', JSON.stringify(companyData));

      // Configura o token no axios
      api.defaults.headers.authorization = `Bearer ${token}`;

      // Atualiza o estado
      setUser(userData);
      setCompany(companyData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao fazer login'
      };
    }
  };

  const signUp = async (companyData, userData) => {
    try {
      const response = await api.post('/auth/register', {
        company: companyData,
        user: userData
      });
      
      const { token, user: newUser, company: newCompany } = response.data;

      // Salva no localStorage
      localStorage.setItem('@GestaoRotas:token', token);
      localStorage.setItem('@GestaoRotas:user', JSON.stringify(newUser));
      localStorage.setItem('@GestaoRotas:company', JSON.stringify(newCompany));

      // Configura o token no axios
      api.defaults.headers.authorization = `Bearer ${token}`;

      // Atualiza o estado
      setUser(newUser);
      setCompany(newCompany);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao fazer cadastro'
      };
    }
  };

  const signOut = () => {
    // Remove do localStorage
    localStorage.removeItem('@GestaoRotas:token');
    localStorage.removeItem('@GestaoRotas:user');
    localStorage.removeItem('@GestaoRotas:company');

    // Remove o token do axios
    delete api.defaults.headers.authorization;

    // Limpa o estado
    setUser(null);
    setCompany(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('@GestaoRotas:user', JSON.stringify(userData));
  };

  const updateCompany = (companyData) => {
    setCompany(companyData);
    localStorage.setItem('@GestaoRotas:company', JSON.stringify(companyData));
  };

  const isAuthenticated = !!user;

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      company,
      loading,
      signIn,
      signUp,
      signOut,
      updateUser,
      updateCompany,
      isAuthenticated,
      hasRole,
      hasAnyRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

