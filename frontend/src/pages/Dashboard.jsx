import { useState, useEffect } from 'react';
import { 
  Truck, 
  Users, 
  Route, 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { companyService } from '../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await companyService.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Erro ao carregar dados do dashboard</p>
      </div>
    );
  }

  const { summary, weeklyRoutes, upcomingRoutes, trucksNeedingMaintenance } = dashboardData;

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visão geral da sua operação de transporte
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Route className="h-5 w-5 text-primary-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rotas Hoje</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.routesToday}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-success-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rotas da Semana</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.totalRoutesThisWeek}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Próximas Rotas</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.upcomingRoutesCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-danger-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-danger-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Manutenção</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.maintenanceNeeded}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Rotas */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Próximas Rotas</h3>
          </div>
          <div className="card-body">
            {upcomingRoutes.length > 0 ? (
              <div className="space-y-4">
                {upcomingRoutes.map((route) => (
                  <div key={route.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {route.origin} → {route.destination}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{format(new Date(route.date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                        <span>{getShiftLabel(route.shift)}</span>
                        <span className={`badge ${getStatusBadge(route.status)}`}>
                          {getStatusLabel(route.status)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {route.truck?.plate}
                      </div>
                      <div className="text-sm text-gray-500">
                        {route.driver?.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma rota agendada</p>
            )}
          </div>
        </div>

        {/* Caminhões com Manutenção Necessária */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Manutenção Necessária</h3>
          </div>
          <div className="card-body">
            {trucksNeedingMaintenance.length > 0 ? (
              <div className="space-y-3">
                {trucksNeedingMaintenance.map((truck) => (
                  <div key={truck.id} className="flex items-center justify-between p-3 bg-warning-50 rounded-lg border border-warning-200">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-5 w-5 text-warning-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {truck.plate}
                        </div>
                        <div className="text-sm text-gray-500">
                          {truck.model} ({truck.year})
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="badge badge-warning">
                        {new Date().getFullYear() - truck.year} anos
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-success-400 mx-auto mb-2" />
                <p className="text-gray-500">Todos os caminhões estão em dia</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rotas da Semana */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Rotas da Semana</h3>
        </div>
        <div className="card-body">
          {weeklyRoutes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th>Data</th>
                    <th>Turno</th>
                    <th>Origem</th>
                    <th>Destino</th>
                    <th>Caminhão</th>
                    <th>Motorista</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {weeklyRoutes.map((route) => (
                    <tr key={route.id}>
                      <td>{format(new Date(route.date), 'dd/MM/yyyy', { locale: ptBR })}</td>
                      <td>{getShiftLabel(route.shift)}</td>
                      <td>{route.origin}</td>
                      <td>{route.destination}</td>
                      <td>{route.truck?.plate}</td>
                      <td>{route.driver?.name}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(route.status)}`}>
                          {getStatusLabel(route.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhuma rota agendada para esta semana</p>
          )}
        </div>
      </div>
    </div>
  );
}

