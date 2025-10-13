import axios, { AxiosInstance } from 'axios';
import toast from 'react-hot-toast';
import { analytics } from './analytics';

// Estender o tipo do Axios para incluir metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token and track performance
    this.api.interceptors.request.use(
      (config) => {
        console.log('Request interceptor called for:', config.url);
        
        // Add performance tracking
        config.metadata = { startTime: performance.now() };
        
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Token added to request:', token.substring(0, 20) + '...');
        } else {
          console.log('No token found in localStorage');
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh and track performance
    this.api.interceptors.response.use(
      (response) => {
        // Track successful API calls
        if (response.config.metadata?.startTime) {
          const duration = performance.now() - response.config.metadata.startTime;
          const endpoint = response.config.url?.replace(API_BASE_URL, '') || 'unknown';
          const method = response.config.method?.toUpperCase() || 'GET';
          
          analytics.trackEvent({
            action: 'api_success',
            category: 'api_performance',
            label: `${method}_${endpoint}`,
            value: Math.round(duration),
            custom_parameters: {
              endpoint: endpoint,
              method: method,
              status: response.status,
            },
          });
        }
        return response;
      },
      async (error) => {
        // Track failed API calls
        if (error.config?.metadata?.startTime) {
          const duration = performance.now() - error.config.metadata.startTime;
          const endpoint = error.config.url?.replace(API_BASE_URL, '') || 'unknown';
          const method = error.config.method?.toUpperCase() || 'GET';
          
          analytics.trackEvent({
            action: 'api_error',
            category: 'api_performance',
            label: `${method}_${endpoint}`,
            value: Math.round(duration),
            custom_parameters: {
              endpoint: endpoint,
              method: method,
              status: error.response?.status || 0,
              error_message: error.message,
            },
          });
        }
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                refreshToken,
              });

              const { accessToken, refreshToken: newRefreshToken } = response.data.data;
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('refreshToken', newRefreshToken);

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else if (error.message) {
          toast.error(error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(data: any) {
    const response = await this.api.post('/auth/register', data);
    return response.data;
  }

  async refreshToken(refreshToken: string) {
    const response = await this.api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  // Employee endpoints
  async getEmployees() {
    const response = await this.api.get('/employees');
    return response.data;
  }


  // Route endpoints
  async getRoutes() {
    const response = await this.api.get('/routes');
    return response.data;
  }

  async getRoute(id: string) {
    const response = await this.api.get(`/routes/${id}`);
    return response.data;
  }

  async getRoutesByEmployee(employeeId: string) {
    const response = await this.api.get(`/routes/employee/${employeeId}`);
    return response.data;
  }

  async createRoute(data: any) {
    const response = await this.api.post('/routes', data);
    return response.data;
  }

  async updateRoute(id: string, data: any) {
    const response = await this.api.put(`/routes/${id}`, data);
    return response.data;
  }

  async deleteRoute(id: string, force: boolean = false) {
    const response = await this.api.delete(`/routes/${id}${force ? '?force=true' : ''}`);
    return response.data;
  }

  async toggleRouteStatus(id: string) {
    const response = await this.api.patch(`/routes/${id}/toggle-status`);
    return response.data;
  }

  // Route Execution endpoints
  async getRouteExecutions() {
    const response = await this.api.get('/route-executions');
    return response.data;
  }

  async getMyRouteExecutions() {
    const response = await this.api.get('/route-executions/my-executions');
    return response.data;
  }

  async getRouteExecution(id: string) {
    const response = await this.api.get(`/route-executions/${id}`);
    return response.data;
  }

  async startRouteExecution(data: any) {
    const response = await this.api.post('/route-executions/start', data);
    return response.data;
  }

  async updateRouteExecution(id: string, data: any) {
    const response = await this.api.put(`/route-executions/${id}`, data);
    return response.data;
  }

  async getRouteExecutionsByDateRange(startDate: string, endDate: string) {
    const response = await this.api.get('/route-executions/reports/date-range', {
      params: { startDate, endDate },
    });
    return response.data;
  }

  async getRouteExecutionsByRoute(routeId: string) {
    const response = await this.api.get(`/route-executions/route/${routeId}`);
    return response.data;
  }

  // Employee methods
  async createEmployee(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role?: string;
  }) {
    const response = await this.api.post('/employees', data);
    return response.data;
  }

  async getAllEmployees() {
    const response = await this.api.get('/employees');
    return response.data;
  }

  async getEmployeeById(id: string) {
    const response = await this.api.get(`/employees/${id}`);
    return response.data;
  }

  async updateEmployee(id: string, data: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  }) {
    const response = await this.api.put(`/employees/${id}`, data);
    return response.data;
  }

  async deleteEmployee(id: string, force: boolean = false) {
    const response = await this.api.delete(`/employees/${id}${force ? '?force=true' : ''}`);
    return response.data;
  }

  async toggleEmployeeStatus(id: string) {
    const response = await this.api.patch(`/employees/${id}/toggle-status`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
