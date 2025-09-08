import { useState, useEffect } from 'react';
import { Plus, Route, Edit, Trash2, Eye, MapPin, Calendar } from 'lucide-react';
import { routeService } from '../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadRoutes();
  }, [statusFilter]);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const filters = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await routeService.getAll(filters);
      setRoutes(response.data);
    } catch (error) {
      console.error('Erro ao carregar rotas:', error);
      toast.error('Erro ao carregar rotas');
    } finally {
      setLoading(false);
    }
  };

  const getShiftLabel = (shift) => {
    const labels = {
      MORNING: 'Manhã',
      AFTERNOON: 'Tarde',
      NIGHT: 'Noite'
    };
    return labels[shift] || shift;
  };

  const getStatusBadge = (status) => {
    const badges = {
      SCHEDULED: 'badge-info',
      IN_PROGRESS: 'badge-warning',
      COMPLETED: 'badge-success',
      CANCELLED: 'badge-danger'
    };
    return badges[status] || 'badge-info';
  };

  const getStatusLabel = (status) => {
    const labels = {
      SCHEDULED: 'Agendada',
      IN_PROGRESS: 'Em Andamento',
      COMPLETED: 'Concluída',
      CANCELLED: 'Cancelada'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rotas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as rotas de transporte da sua empresa
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Nova Rota
        </button>
      </div>

      {/* Filtros por status */}
      <div className="flex space-x-4">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            statusFilter === 'all'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setStatusFilter('SCHEDULED')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            statusFilter === 'SCHEDULED'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Agendadas
        </button>
        <button
          onClick={() => setStatusFilter('IN_PROGRESS')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            statusFilter === 'IN_PROGRESS'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Em Andamento
        </button>
        <button
          onClick={() => setStatusFilter('COMPLETED')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            statusFilter === 'COMPLETED'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Concluídas
        </button>
      </div>

      {/* Lista de rotas */}
      <div className="card">
        <div className="card-body">
          {routes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th>Data</th>
                    <th>Turno</th>
                    <th>Origem → Destino</th>
                    <th>Caminhão</th>
                    <th>Motorista</th>
                    <th>Ajudante</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {routes.map((route) => (
                    <tr key={route.id}>
                      <td>{format(new Date(route.date), 'dd/MM/yyyy', { locale: ptBR })}</td>
                      <td>{getShiftLabel(route.shift)}</td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{route.origin}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-medium">{route.destination}</span>
                        </div>
                      </td>
                      <td>{route.truck?.plate}</td>
                      <td>{route.driver?.name}</td>
                      <td>{route.helper?.name}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(route.status)}`}>
                          {getStatusLabel(route.status)}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-primary-600">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-warning-600">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-danger-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Route className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {statusFilter === 'all' 
                  ? 'Nenhuma rota cadastrada'
                  : `Nenhuma rota ${getStatusLabel(statusFilter).toLowerCase()}`
                }
              </h3>
              <p className="text-gray-500 mb-4">
                Comece criando a primeira rota de transporte
              </p>
              <button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Rota
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

