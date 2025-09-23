export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'employee';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Route {
  id: string;
  name: string;
  description?: string;
  startPoint: string;
  endPoint: string;
  waypoints: string[];
  assignedEmployeeId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RouteExecution {
  id: string;
  routeId: string;
  employeeId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startTime?: string;
  endTime?: string;
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'employee';
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateEmployeeRequest {
  name?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
}

export interface CreateRouteRequest {
  name: string;
  description?: string;
  startPoint: string;
  endPoint: string;
  waypoints?: string[];
  assignedEmployeeId?: string;
}

export interface UpdateRouteRequest {
  name?: string;
  description?: string;
  startPoint?: string;
  endPoint?: string;
  waypoints?: string[];
  assignedEmployeeId?: string;
  isActive?: boolean;
}

export interface StartRouteExecutionRequest {
  routeId: string;
}

export interface UpdateRouteExecutionRequest {
  status?: 'in_progress' | 'completed' | 'cancelled';
  observations?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}
