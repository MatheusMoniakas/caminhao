import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MapPin, Trash2, Play, CheckCircle, Clock, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import AddRouteModal from '@/components/AddRouteModal';
import apiService from '@/services/api';

interface Route {
  id: string;
  name: string;
  description?: string;
  startPoint?: string;
  endPoint?: string;
  waypoints: string[];
  driverId: string;
  helperId?: string;
  driver?: {
    id: string;
    name: string;
  };
  helper?: {
    id: string;
    name: string;
  };
  scheduledDate?: string;
  shift?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RouteExecution {
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

const Routes: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [duplicateRouteData, setDuplicateRouteData] = useState<Route | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [executions, setExecutions] = useState<RouteExecution[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const [routesResponse, executionsResponse] = await Promise.all([
        apiService.getRoutes(),
        apiService.getRouteExecutions()
      ]);
      
      if (routesResponse.success) {
        setRoutes(routesResponse.data);
      }
      
      if (executionsResponse.success) {
        setExecutions(executionsResponse.data);
      }
    } catch (error) {
      console.error('Erro ao carregar rotas:', error);
      toast.error('Erro ao carregar rotas');
    } finally {
      setLoading(false);
    }
  };

  const handleRouteCreated = () => {
    loadRoutes();
  };

  const handleDuplicateRoute = (route: Route) => {
    setDuplicateRouteData(route);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDuplicateRouteData(null);
  };

  const getRouteExecutionStatus = (routeId: string) => {
    const execution = executions.find(exec => exec.routeId === routeId);
    return execution?.status || 'pending';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pendente' },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: Play, text: 'Em Execução' },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Concluída' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: Clock, text: 'Cancelada' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const formatShift = (shift: string) => {
    const shiftConfig = {
      manha: 'Manhã (06:00 - 12:00)',
      tarde: 'Tarde (12:00 - 18:00)',
      noite: 'Noite (18:00 - 00:00)',
      madrugada: 'Madrugada (00:00 - 06:00)'
    };
    return shiftConfig[shift as keyof typeof shiftConfig] || shift;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };


  const handleDeleteRoute = async (routeId: string, routeName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a rota "${routeName}"?`)) {
      try {
        const response = await apiService.deleteRoute(routeId);
        if (response.success) {
          toast.success('Rota excluída com sucesso!');
          loadRoutes();
        } else {
          toast.error(response.error || 'Erro ao excluir rota');
        }
      } catch (error: any) {
        console.error('Erro ao excluir rota:', error);
        toast.error(error.response?.data?.error || 'Erro ao excluir rota');
      }
    }
  };

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (route.startPoint && route.startPoint.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (route.endPoint && route.endPoint.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (route.driver && route.driver.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (route.helper && route.helper.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === '' || 
                         (statusFilter === 'active' && route.isActive) ||
                         (statusFilter === 'inactive' && !route.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Rotas</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Gerencie as rotas de entrega
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Rota
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Buscar
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Nome da rota"
              />
            </div>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">Todas</option>
              <option value="active">Ativas</option>
              <option value="inactive">Inativas</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </button>
          </div>
        </div>
      </div>

      {/* Routes Table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Carregando rotas...</p>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="p-12 text-center">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              {routes.length === 0 ? 'Nenhuma rota' : 'Nenhuma rota encontrada'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {routes.length === 0 
                ? 'Comece criando uma nova rota de entrega.'
                : 'Tente ajustar os filtros de busca.'
              }
            </p>
            {routes.length === 0 && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Rota
                </button>
              </div>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredRoutes.map((route) => (
              <li key={route.id} className={`${!route.isActive ? 'bg-gray-50 opacity-75' : ''}`}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <MapPin className="h-8 w-8 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {route.name}
                          </h3>
                          <div className="ml-3">
                            {getStatusBadge(getRouteExecutionStatus(route.id))}
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {route.startPoint && <p><strong>De:</strong> {route.startPoint}</p>}
                          {route.endPoint && <p><strong>Para:</strong> {route.endPoint}</p>}
                          {route.description && (
                            <p><strong>Descrição:</strong> {route.description}</p>
                          )}
                          {route.driver && (
                            <p><strong>Motorista:</strong> {route.driver.name}</p>
                          )}
                          {route.helper && (
                            <p><strong>Ajudante:</strong> {route.helper.name}</p>
                          )}
                          {route.waypoints && route.waypoints.length > 0 && (
                            <p><strong>Paradas:</strong> {route.waypoints.join(', ')}</p>
                          )}
                          {(route.scheduledDate || route.shift) && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {route.scheduledDate && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                  📅 {formatDate(route.scheduledDate)}
                                </span>
                              )}
                              {route.shift && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                                  🕐 {formatShift(route.shift)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDuplicateRoute(route)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Duplicar rota"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRoute(route.id, route.name)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir rota"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Route Modal */}
      <AddRouteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRouteCreated={handleRouteCreated}
        duplicateRouteData={duplicateRouteData}
      />
    </div>
  );
};

export default Routes;
