import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Truck, BarChart3, TrendingUp, Clock, CheckCircle } from 'lucide-react';
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
      // Rotas ativas são aquelas que têm execuções pendentes ou em progresso
      const activeRoutes = routes.filter((route: any) => {
        const routeExecution = executions.find((exec: any) => exec.routeId === route.id);
        return routeExecution && (routeExecution.status === 'pending' || routeExecution.status === 'in_progress');
      }).length;
      
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
    <div className="space-y-8">
      {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Olá, {user?.name}! 👋
            </h1>
            <p className="mt-2 text-blue-100 dark:text-blue-200 text-lg">
              Bem-vindo ao FleetManager - Sistema de gestão de frotas
            </p>
            <p className="mt-1 text-blue-200 dark:text-blue-300 text-sm">
              Acompanhe o desempenho da sua operação em tempo real
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 dark:bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Truck className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                  <Users className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 truncate">
                    Total de Funcionários
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {loading ? '...' : stats.totalEmployees}
                  </dd>
                  <dd className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% este mês
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
                  <MapPin className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 truncate">
                    Rotas Ativas
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {loading ? '...' : stats.activeRoutes}
                  </dd>
                  <dd className="text-xs text-green-600 flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Operacionais
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
                  <Truck className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 truncate">
                    Rotas em Execução
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {loading ? '...' : stats.routesInExecution}
                  </dd>
                  <dd className="text-xs text-amber-600 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Em andamento
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 truncate">
                    Rotas Concluídas Hoje
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {loading ? '...' : stats.completedRoutesToday}
                  </dd>
                  <dd className="text-xs text-purple-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8% vs ontem
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700">
        <div className="px-8 py-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <button 
              onClick={handleNavigateToEmployees}
              className="group relative bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-black group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    Gerenciar Funcionários
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Adicionar, editar ou desativar funcionários
                  </p>
                  <div className="mt-3 flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                    <span>Acessar</span>
                    <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>

            <button 
              onClick={handleNavigateToRoutes}
              className="group relative bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/20"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                    Gerenciar Rotas
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Criar e configurar novas rotas
                  </p>
                  <div className="mt-3 flex items-center text-sm text-green-600 font-medium">
                    <span>Acessar</span>
                    <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
