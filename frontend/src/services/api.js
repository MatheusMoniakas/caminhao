import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@GestaoRotas:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('@GestaoRotas:token');
      localStorage.removeItem('@GestaoRotas:user');
      localStorage.removeItem('@GestaoRotas:company');
      
      // Redireciona para login se estiver em uma rota protegida
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Serviços específicos
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (companyData, userData) => api.post('/auth/register', { company: companyData, user: userData }),
  getProfile: () => api.get('/auth/me'),
};

export const companyService = {
  getProfile: () => api.get('/companies/profile'),
  updateProfile: (data) => api.put('/companies/profile', data),
  getStats: (startDate, endDate) => api.get('/companies/stats', { params: { startDate, endDate } }),
  getDashboard: () => api.get('/companies/dashboard'),
};

export const truckService = {
  getAll: () => api.get('/trucks'),
  getById: (id) => api.get(`/trucks/${id}`),
  create: (data) => api.post('/trucks', data),
  update: (id, data) => api.put(`/trucks/${id}`, data),
  delete: (id) => api.delete(`/trucks/${id}`),
  updateAvailability: (id, isAvailable) => api.patch(`/trucks/${id}/availability`, { isAvailable }),
  getAvailable: () => api.get('/trucks/available'),
};

export const employeeService = {
  getAll: (functionType) => api.get('/employees', { params: { function: functionType } }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  updateAvailability: (id, isAvailable) => api.patch(`/employees/${id}/availability`, { isAvailable }),
  getAvailable: (functionType) => api.get('/employees/available', { params: { function: functionType } }),
  getDrivers: () => api.get('/employees/drivers'),
  getHelpers: () => api.get('/employees/helpers'),
};

export const routeService = {
  getAll: (filters = {}) => api.get('/routes', { params: filters }),
  getById: (id) => api.get(`/routes/${id}`),
  create: (data) => api.post('/routes', data),
  update: (id, data) => api.put(`/routes/${id}`, data),
  delete: (id) => api.delete(`/routes/${id}`),
  updateStatus: (id, status) => api.patch(`/routes/${id}/status`, { status }),
  getByDate: (date) => api.get(`/routes/calendar/${date}`),
};

export default api;

