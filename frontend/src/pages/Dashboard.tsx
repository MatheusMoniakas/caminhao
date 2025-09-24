import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Truck, BarChart3 } from 'lucide-react';
import apiService from '@/services/api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeRoutes: 0,
    routesInExecution: 0,
    completedRoutesToday: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Carregar dados em paralelo
      const [employeesResponse, routesResponse, executionsResponse] = await Promise.all([
        apiService.getAllEmployees(),
        apiService.getRoutes(),
        apiService.getRouteExecutions()
      ]);

      const employees = employeesResponse.success ? employeesResponse.data : [];
      const routes = routesResponse.success ? routesResponse.data : [];
      const executions = executionsResponse.success ? executionsResponse.data : [];

      // Calcular estatísticas
      const activeRoutes = routes.filter((route: any) => route.isActive).length;
      const routesInExecution = executions.filter((exec: any) => exec.status === 'in_progress').length;
      
      // Rotas concluídas hoje
      const today = new Date().toISOString().split('T')[0];
      const completedToday = executions.filter((exec: any) => 
        exec.status === 'completed' && 
        exec.endTime && 
        exec.endTime.startsWith(today)
      ).length;

      setStats({
        totalEmployees: employees.length,
        activeRoutes,
        routesInExecution,
        completedRoutesToday: completedToday
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToEmployees = () => {
    navigate('/employees');
  };

  const handleNavigateToRoutes = () => {
    navigate('/routes');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {user?.name}! 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Bem-vindo ao sistema de gestão de rotas de caminhões
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-blue-500">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Funcionários
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {loading ? '...' : stats.totalEmployees}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-green-500">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Rotas Ativas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {loading ? '...' : stats.activeRoutes}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-yellow-500">
                  <Truck className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Rotas em Execução
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {loading ? '...' : stats.routesInExecution}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-purple-500">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Rotas Concluídas Hoje
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {loading ? '...' : stats.completedRoutesToday}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Ações Rápidas
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button 
              onClick={handleNavigateToEmployees}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                  <Users className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Gerenciar Funcionários
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Adicionar, editar ou desativar funcionários
                </p>
              </div>
            </button>

            <button 
              onClick={handleNavigateToRoutes}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                  <MapPin className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Gerenciar Rotas
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Criar e configurar novas rotas
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
