import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../services/analytics';

/**
 * Hook para tracking automático de performance e erros
 */
export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page load performance
    const startTime = performance.now();
    
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      analytics.trackPerformance('page_load_time', Math.round(loadTime));
    };

    // Track when page is fully loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, [location]);

  useEffect(() => {
    // Track JavaScript errors
    const handleError = (event: ErrorEvent) => {
      analytics.trackError(
        'javascript_error',
        event.message || 'Unknown error',
        location.pathname
      );
    };

    // Track unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || event.reason || 'Unhandled promise rejection';
      analytics.trackError(
        'unhandled_promise_rejection',
        errorMessage,
        location.pathname
      );
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [location]);

  return analytics;
};

/**
 * Hook para tracking de interações do usuário
 */
export const useUserInteractionTracking = () => {
  const analytics = useAnalytics();

  const trackButtonClick = (buttonName: string, page: string) => {
    analytics.trackEvent({
      action: 'click',
      category: 'user_interaction',
      label: `button_${buttonName}`,
      custom_parameters: {
        page: page,
      },
    });
  };

  const trackFormSubmission = (formName: string, success: boolean) => {
    analytics.trackEvent({
      action: success ? 'submit_success' : 'submit_error',
      category: 'form_interaction',
      label: formName,
    });
  };

  const trackSearch = (searchTerm: string, resultsCount: number) => {
    analytics.trackSearchPerformed(searchTerm, resultsCount);
  };

  const trackFilter = (filterType: string, filterValue: string) => {
    analytics.trackFilterApplied(filterType, filterValue);
  };

  return {
    trackButtonClick,
    trackFormSubmission,
    trackSearch,
    trackFilter,
  };
};

/**
 * Hook para tracking de performance de API
 */
export const useApiPerformanceTracking = () => {
  const analytics = useAnalytics();

  const trackApiCall = (endpoint: string, method: string, duration: number, success: boolean) => {
    analytics.trackEvent({
      action: success ? 'api_success' : 'api_error',
      category: 'api_performance',
      label: `${method}_${endpoint}`,
      value: Math.round(duration),
      custom_parameters: {
        endpoint: endpoint,
        method: method,
        success: success,
      },
    });
  };

  return { trackApiCall };
};
