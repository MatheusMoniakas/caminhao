/**
 * Configuração do Google Analytics
 * Centraliza todas as configurações relacionadas ao analytics
 */

export const ANALYTICS_CONFIG = {
  // IDs de medição por ambiente
  measurementIds: {
    development: import.meta.env.VITE_GA_MEASUREMENT_ID_DEV || 'G-DEV-XXXXXXXXXX',
    production: import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
  },

  // Configurações de debug
  debug: {
    enabled: import.meta.env.DEV,
    logEvents: import.meta.env.VITE_GA_DEBUG === 'true',
  },

  // Configurações de privacidade
  privacy: {
    anonymizeIp: true,
    allowGoogleSignals: false,
    allowAdPersonalization: false,
  },

  // Configurações de performance
  performance: {
    trackPageLoad: true,
    trackApiCalls: true,
    trackUserInteractions: true,
  },

  // Configurações de cookies
  cookies: {
    sameSite: 'None' as const,
    secure: true,
    expires: 365, // dias
  },

  // Configurações de eventos
  events: {
    // Categorias de eventos
    categories: {
      AUTHENTICATION: 'authentication',
      EMPLOYEE_MANAGEMENT: 'employee_management',
      ROUTE_MANAGEMENT: 'route_management',
      ROUTE_EXECUTION: 'route_execution',
      PROBLEM_MANAGEMENT: 'problem_management',
      WHATSAPP_NOTIFICATIONS: 'whatsapp_notifications',
      USER_INTERACTION: 'user_interaction',
      API_PERFORMANCE: 'api_performance',
      APPLICATION_ERRORS: 'application_errors',
      APPLICATION_PERFORMANCE: 'application_performance',
      REPORTS: 'reports',
      DATA_EXPORT: 'data_export',
      SETTINGS: 'settings',
      UI_PREFERENCES: 'ui_preferences',
    },

    // Ações comuns
    actions: {
      CREATE: 'create',
      UPDATE: 'update',
      DELETE: 'delete',
      VIEW: 'view',
      CLICK: 'click',
      SEARCH: 'search',
      FILTER: 'filter',
      EXPORT: 'export',
      IMPORT: 'import',
      LOGIN: 'login',
      LOGOUT: 'logout',
      ERROR: 'error',
      SUCCESS: 'success',
    },

    // Labels comuns
    labels: {
      BUTTON: 'button',
      FORM: 'form',
      LINK: 'link',
      MENU: 'menu',
      MODAL: 'modal',
      TAB: 'tab',
      DROPDOWN: 'dropdown',
    },
  },

  // Configurações de métricas
  metrics: {
    // Limites de valores
    maxValue: 1000000,
    minValue: 0,
    
    // Unidades padrão
    units: {
      TIME: 'ms',
      COUNT: 'count',
      PERCENTAGE: '%',
      BYTES: 'bytes',
    },
  },

  // Configurações de sampling
  sampling: {
    // Taxa de sampling para eventos (0-1)
    eventSampling: 1.0,
    
    // Taxa de sampling para page views (0-1)
    pageViewSampling: 1.0,
  },

  // Configurações de retry
  retry: {
    maxRetries: 3,
    retryDelay: 1000, // ms
  },
} as const;

/**
 * Obtém o ID de medição baseado no ambiente
 */
export const getMeasurementId = (): string => {
  const isProduction = import.meta.env.PROD;
  return isProduction 
    ? ANALYTICS_CONFIG.measurementIds.production
    : ANALYTICS_CONFIG.measurementIds.development;
};

/**
 * Verifica se o analytics está habilitado
 */
export const isAnalyticsEnabled = (): boolean => {
  const measurementId = getMeasurementId();
  return measurementId && measurementId !== 'G-XXXXXXXXXX' && measurementId !== 'G-DEV-XXXXXXXXXX';
};

/**
 * Configurações do gtag
 */
export const getGtagConfig = () => ({
  send_page_view: false, // Controlamos manualmente
  anonymize_ip: ANALYTICS_CONFIG.privacy.anonymizeIp,
  allow_google_signals: ANALYTICS_CONFIG.privacy.allowGoogleSignals,
  allow_ad_personalization_signals: ANALYTICS_CONFIG.privacy.allowAdPersonalization,
  cookie_flags: `SameSite=${ANALYTICS_CONFIG.cookies.sameSite};Secure`,
});

/**
 * Configurações do React GA4
 */
export const getReactGA4Config = () => ({
  testMode: ANALYTICS_CONFIG.debug.enabled,
  gtagOptions: getGtagConfig(),
});

export default ANALYTICS_CONFIG;
