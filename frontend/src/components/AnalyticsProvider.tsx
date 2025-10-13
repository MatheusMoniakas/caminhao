import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../services/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

/**
 * Provider que gerencia o tracking automático de páginas
 * Deve ser usado no nível mais alto da aplicação
 */
export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Inicializa o analytics quando o componente é montado
    analytics.initialize();
  }, []);

  useEffect(() => {
    // Track page view sempre que a rota mudar
    const pageTitle = getPageTitle(location.pathname);
    
    analytics.trackPageView({
      page_title: pageTitle,
      page_location: window.location.href,
      page_path: location.pathname,
    });
  }, [location]);

  return <>{children}</>;
};

/**
 * Mapeia as rotas para títulos de página mais amigáveis
 */
function getPageTitle(pathname: string): string {
  const titleMap: Record<string, string> = {
    '/': 'Dashboard',
    '/login': 'Login',
    '/dashboard': 'Dashboard',
    '/employees': 'Funcionários',
    '/employees/new': 'Novo Funcionário',
    '/routes': 'Rotas',
    '/routes/new': 'Nova Rota',
    '/routes/executions': 'Execução de Rotas',
    '/reports': 'Relatórios',
    '/problems': 'Problemas',
    '/settings': 'Configurações',
    '/profile': 'Perfil',
  };

  // Tenta encontrar uma correspondência exata primeiro
  if (titleMap[pathname]) {
    return `${titleMap[pathname]} - Sistema de Gestão de Rotas`;
  }

  // Para rotas dinâmicas, tenta extrair o padrão
  if (pathname.startsWith('/employees/') && pathname !== '/employees/new') {
    return 'Editar Funcionário - Sistema de Gestão de Rotas';
  }

  if (pathname.startsWith('/routes/') && !pathname.includes('/new') && !pathname.includes('/executions')) {
    return 'Editar Rota - Sistema de Gestão de Rotas';
  }

  if (pathname.startsWith('/routes/executions/')) {
    return 'Detalhes da Execução - Sistema de Gestão de Rotas';
  }

  // Fallback para rotas não mapeadas
  return 'Sistema de Gestão de Rotas';
}
