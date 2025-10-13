import ReactGA from 'react-ga4';
import { getMeasurementId, isAnalyticsEnabled, getReactGA4Config, ANALYTICS_CONFIG } from '../config/analytics';

// Tipos para eventos customizados
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface PageViewEvent {
  page_title: string;
  page_location: string;
  page_path?: string;
}

class AnalyticsService {
  private measurementId: string;
  private isInitialized: boolean = false;

  constructor() {
    this.measurementId = getMeasurementId();
  }

  /**
   * Inicializa o Google Analytics
   */
  initialize(): void {
    if (!isAnalyticsEnabled()) {
      console.warn('Google Analytics não configurado. Measurement ID não definido ou inválido.');
      return;
    }

    try {
      ReactGA.initialize(this.measurementId, getReactGA4Config());
      this.isInitialized = true;
      
      if (ANALYTICS_CONFIG.debug.logEvents) {
        console.log('Google Analytics inicializado com sucesso:', {
          measurementId: this.measurementId,
          testMode: ANALYTICS_CONFIG.debug.enabled,
        });
      }
    } catch (error) {
      console.error('Erro ao inicializar Google Analytics:', error);
    }
  }

  /**
   * Verifica se o analytics está inicializado
   */
  private checkInitialization(): boolean {
    if (!this.isInitialized) {
      console.warn('Google Analytics não foi inicializado');
      return false;
    }
    return true;
  }

  /**
   * Envia uma page view
   */
  trackPageView(pageData: PageViewEvent): void {
    if (!this.checkInitialization()) return;

    try {
      ReactGA.send({
        hitType: 'pageview',
        page_title: pageData.page_title,
        page_location: pageData.page_location,
        page_path: pageData.page_path || window.location.pathname,
      });
    } catch (error) {
      console.error('Erro ao enviar page view:', error);
    }
  }

  /**
   * Envia um evento customizado
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.checkInitialization()) return;

    try {
      ReactGA.event({
        action: event.action,
        category: event.category,
        label: event.label,
        value: event.value,
        ...event.custom_parameters,
      });
    } catch (error) {
      console.error('Erro ao enviar evento:', error);
    }
  }

  /**
   * Eventos específicos do sistema de gestão de rotas
   */

  // Autenticação
  trackLogin(method: string = 'email'): void {
    this.trackEvent({
      action: 'login',
      category: 'authentication',
      label: method,
    });
  }

  trackLogout(): void {
    this.trackEvent({
      action: 'logout',
      category: 'authentication',
    });
  }

  trackLoginError(errorType: string): void {
    this.trackEvent({
      action: 'login_error',
      category: 'authentication',
      label: errorType,
    });
  }

  // Gestão de Funcionários
  trackEmployeeCreated(): void {
    this.trackEvent({
      action: 'create',
      category: 'employee_management',
      label: 'new_employee',
    });
  }

  trackEmployeeUpdated(): void {
    this.trackEvent({
      action: 'update',
      category: 'employee_management',
      label: 'employee_updated',
    });
  }

  trackEmployeeDeactivated(): void {
    this.trackEvent({
      action: 'deactivate',
      category: 'employee_management',
      label: 'employee_deactivated',
    });
  }

  // Gestão de Rotas
  trackRouteCreated(routeType: string = 'standard'): void {
    this.trackEvent({
      action: 'create',
      category: 'route_management',
      label: routeType,
    });
  }

  trackRouteUpdated(): void {
    this.trackEvent({
      action: 'update',
      category: 'route_management',
      label: 'route_updated',
    });
  }

  trackRouteDuplicated(): void {
    this.trackEvent({
      action: 'duplicate',
      category: 'route_management',
      label: 'route_duplicated',
    });
  }

  // Execução de Rotas
  trackRouteStarted(routeId: string): void {
    this.trackEvent({
      action: 'start',
      category: 'route_execution',
      label: 'route_started',
      custom_parameters: {
        route_id: routeId,
      },
    });
  }

  trackRouteCompleted(routeId: string, duration?: number): void {
    this.trackEvent({
      action: 'complete',
      category: 'route_execution',
      label: 'route_completed',
      value: duration,
      custom_parameters: {
        route_id: routeId,
      },
    });
  }

  trackRouteCancelled(routeId: string, reason?: string): void {
    this.trackEvent({
      action: 'cancel',
      category: 'route_execution',
      label: 'route_cancelled',
      custom_parameters: {
        route_id: routeId,
        reason: reason,
      },
    });
  }

  // Gestão de Problemas
  trackProblemReported(problemType: string): void {
    this.trackEvent({
      action: 'report',
      category: 'problem_management',
      label: problemType,
    });
  }

  trackProblemResolved(problemType: string): void {
    this.trackEvent({
      action: 'resolve',
      category: 'problem_management',
      label: problemType,
    });
  }

  // WhatsApp
  trackWhatsAppNotificationSent(notificationType: string): void {
    this.trackEvent({
      action: 'send',
      category: 'whatsapp_notifications',
      label: notificationType,
    });
  }

  trackWhatsAppNotificationFailed(notificationType: string, error: string): void {
    this.trackEvent({
      action: 'send_failed',
      category: 'whatsapp_notifications',
      label: notificationType,
      custom_parameters: {
        error: error,
      },
    });
  }

  // Interface e UX
  trackThemeChanged(theme: 'light' | 'dark'): void {
    this.trackEvent({
      action: 'change',
      category: 'ui_preferences',
      label: `theme_${theme}`,
    });
  }

  trackSearchPerformed(searchTerm: string, resultsCount: number): void {
    this.trackEvent({
      action: 'search',
      category: 'user_interaction',
      label: 'search_performed',
      value: resultsCount,
      custom_parameters: {
        search_term: searchTerm,
      },
    });
  }

  trackFilterApplied(filterType: string, filterValue: string): void {
    this.trackEvent({
      action: 'filter',
      category: 'user_interaction',
      label: 'filter_applied',
      custom_parameters: {
        filter_type: filterType,
        filter_value: filterValue,
      },
    });
  }

  // Performance e Erros
  trackError(errorType: string, errorMessage: string, page: string): void {
    this.trackEvent({
      action: 'error',
      category: 'application_errors',
      label: errorType,
      custom_parameters: {
        error_message: errorMessage,
        page: page,
      },
    });
  }

  trackPerformance(metric: string, value: number, unit: string = 'ms'): void {
    this.trackEvent({
      action: 'performance',
      category: 'application_performance',
      label: metric,
      value: value,
      custom_parameters: {
        unit: unit,
      },
    });
  }

  // Relatórios e Exportação
  trackReportGenerated(reportType: string): void {
    this.trackEvent({
      action: 'generate',
      category: 'reports',
      label: reportType,
    });
  }

  trackDataExported(exportType: string, recordCount: number): void {
    this.trackEvent({
      action: 'export',
      category: 'data_export',
      label: exportType,
      value: recordCount,
    });
  }

  // Configurações
  trackSettingsChanged(settingType: string): void {
    this.trackEvent({
      action: 'change',
      category: 'settings',
      label: settingType,
    });
  }

  /**
   * Define propriedades do usuário
   */
  setUserProperties(userId: string, userRole: string): void {
    if (!this.checkInitialization()) return;

    try {
      ReactGA.set({
        user_id: userId,
        user_role: userRole,
      });
    } catch (error) {
      console.error('Erro ao definir propriedades do usuário:', error);
    }
  }

  /**
   * Limpa as propriedades do usuário (logout)
   */
  clearUserProperties(): void {
    if (!this.checkInitialization()) return;

    try {
      ReactGA.set({
        user_id: null,
        user_role: null,
      });
    } catch (error) {
      console.error('Erro ao limpar propriedades do usuário:', error);
    }
  }
}

// Instância singleton
export const analytics = new AnalyticsService();

// Hook para usar o analytics em componentes React
export const useAnalytics = () => {
  return analytics;
};

export default analytics;
