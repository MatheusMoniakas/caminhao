import React from 'react';
import { useUserInteractionTracking } from '../hooks/useAnalytics';
import { analytics } from '../services/analytics';

/**
 * Componente de exemplo mostrando como usar o Google Analytics
 * Este arquivo pode ser removido após implementação
 */
export const AnalyticsExample: React.FC = () => {
  const { trackButtonClick, trackFormSubmission, trackSearch, trackFilter } = useUserInteractionTracking();

  const handleCreateEmployee = () => {
    // Track button click
    trackButtonClick('create_employee', 'employees_page');
    
    // Track business event
    analytics.trackEmployeeCreated();
  };

  const handleCreateRoute = () => {
    // Track button click
    trackButtonClick('create_route', 'routes_page');
    
    // Track business event
    analytics.trackRouteCreated('standard');
  };

  const handleStartRoute = (routeId: string) => {
    // Track business event
    analytics.trackRouteStarted(routeId);
  };

  const handleCompleteRoute = (routeId: string, duration: number) => {
    // Track business event
    analytics.trackRouteCompleted(routeId, duration);
  };

  const handleReportProblem = (problemType: string) => {
    // Track business event
    analytics.trackProblemReported(problemType);
  };

  const handleSearch = (searchTerm: string, resultsCount: number) => {
    // Track search
    trackSearch(searchTerm, resultsCount);
  };

  const handleFilter = (filterType: string, filterValue: string) => {
    // Track filter
    trackFilter(filterType, filterValue);
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    // Track theme change
    analytics.trackThemeChanged(theme);
  };

  const handleFormSubmit = (formName: string, success: boolean) => {
    // Track form submission
    trackFormSubmission(formName, success);
  };

  const handleExportData = (exportType: string, recordCount: number) => {
    // Track data export
    analytics.trackDataExported(exportType, recordCount);
  };

  const handleGenerateReport = (reportType: string) => {
    // Track report generation
    analytics.trackReportGenerated(reportType);
  };

  const handleWhatsAppNotification = (notificationType: string) => {
    // Track WhatsApp notification
    analytics.trackWhatsAppNotificationSent(notificationType);
  };

  const handleWhatsAppError = (notificationType: string, error: string) => {
    // Track WhatsApp error
    analytics.trackWhatsAppNotificationFailed(notificationType, error);
  };

  const handleCustomEvent = () => {
    // Track custom event
    analytics.trackEvent({
      action: 'custom_action',
      category: 'custom_category',
      label: 'custom_label',
      value: 1,
      custom_parameters: {
        custom_param: 'custom_value',
        timestamp: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Exemplos de Uso do Google Analytics</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Eventos de Negócio</h3>
          <button 
            onClick={handleCreateEmployee}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Criar Funcionário
          </button>
          <button 
            onClick={handleCreateRoute}
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Criar Rota
          </button>
          <button 
            onClick={() => handleStartRoute('route-123')}
            className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Iniciar Rota
          </button>
          <button 
            onClick={() => handleCompleteRoute('route-123', 120)}
            className="w-full p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Concluir Rota
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Interações do Usuário</h3>
          <button 
            onClick={() => handleSearch('funcionário', 5)}
            className="w-full p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Buscar
          </button>
          <button 
            onClick={() => handleFilter('status', 'ativo')}
            className="w-full p-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            Filtrar
          </button>
          <button 
            onClick={() => handleThemeChange('dark')}
            className="w-full p-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Mudar Tema
          </button>
          <button 
            onClick={() => handleFormSubmit('employee_form', true)}
            className="w-full p-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            Enviar Formulário
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Relatórios e Exportação</h3>
          <button 
            onClick={() => handleExportData('employees', 25)}
            className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Exportar Dados
          </button>
          <button 
            onClick={() => handleGenerateReport('performance')}
            className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Gerar Relatório
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Notificações e Problemas</h3>
          <button 
            onClick={() => handleReportProblem('mechanical')}
            className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reportar Problema
          </button>
          <button 
            onClick={() => handleWhatsAppNotification('route_assigned')}
            className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Enviar WhatsApp
          </button>
          <button 
            onClick={() => handleWhatsAppError('route_assigned', 'connection_failed')}
            className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Erro WhatsApp
          </button>
          <button 
            onClick={handleCustomEvent}
            className="w-full p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Evento Customizado
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h4 className="font-semibold text-blue-800">Como Usar:</h4>
        <ol className="mt-2 text-sm text-blue-700 list-decimal list-inside space-y-1">
          <li>Clique nos botões para ver os eventos sendo enviados</li>
          <li>Abra o console do navegador para ver os logs</li>
          <li>Verifique o Google Analytics em tempo real</li>
          <li>Use o Google Analytics Debugger para debug</li>
        </ol>
      </div>
    </div>
  );
};

export default AnalyticsExample;
