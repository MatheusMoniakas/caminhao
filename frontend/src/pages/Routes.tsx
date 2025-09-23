import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MapPin, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import AddRouteModal from '@/components/AddRouteModal';
import apiService from '@/services/api';

interface Route {
  id: string;
  name: string;
  description?: string;
  startPoint: string;
  endPoint: string;
  waypoints: string[];
  assignedEmployeeId?: string;
  assignedEmployee?: {
    id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const Routes: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const response = await apiService.getRoutes();
      if (response.success) {
        setRoutes(response.data);
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

  const handleToggleStatus = async (routeId: string, currentStatus: boolean) => {
    try {
      const response = await apiService.toggleRouteStatus(routeId);
      if (response.success) {
        toast.success(`Rota ${currentStatus ? 'desativada' : 'ativada'} com sucesso!`);
        loadRoutes();
      } else {
        toast.error(response.error || 'Erro ao alterar status da rota');
      }
    } catch (error: any) {
      console.error('Erro ao alterar status da rota:', error);
      toast.error(error.response?.data?.error || 'Erro ao alterar status da rota');
    }
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
                         route.startPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.endPoint.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || 
                         (statusFilter === 'active' && route.isActive) ||
                         (statusFilter === 'inactive' && !route.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Rotas</h1>
          <p className="mt-2 text-sm text-gray-700">
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
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-sm text-gray-500">Carregando rotas...</p>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="p-12 text-center">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {routes.length === 0 ? 'Nenhuma rota' : 'Nenhuma rota encontrada'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
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
                          <h3 className="text-lg font-medium text-gray-900">
                            {route.name}
                          </h3>
                          {!route.isActive && (
                            <span className="ml-2 text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                              INATIVA
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          <p><strong>De:</strong> {route.startPoint}</p>
                          <p><strong>Para:</strong> {route.endPoint}</p>
                          {route.description && (
                            <p><strong>Descrição:</strong> {route.description}</p>
                          )}
                          {route.assignedEmployee && (
                            <p><strong>Responsável:</strong> {route.assignedEmployee.name}</p>
                          )}
                          {route.waypoints && route.waypoints.length > 0 && (
                            <p><strong>Paradas:</strong> {route.waypoints.join(', ')}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleStatus(route.id, route.isActive)}
                        className={`${
                          route.isActive 
                            ? 'text-orange-600 hover:text-orange-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                        title={route.isActive ? 'Desativar rota' : 'Ativar rota'}
                      >
                        {route.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
        onClose={() => setIsModalOpen(false)}
        onRouteCreated={handleRouteCreated}
      />
    </div>
  );
};

export default Routes;
