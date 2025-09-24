import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, User, MapPin, Filter, Search, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import apiService from '@/services/api';

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
  route?: {
    id: string;
    name: string;
    description?: string;
    startPoint?: string;
    endPoint?: string;
    scheduledDate?: string;
    shift?: string;
  };
  employee?: {
    id: string;
    name: string;
    email: string;
  };
}

const Problems: React.FC = () => {
  const [problems, setProblems] = useState<RouteExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRouteExecutions();
      if (response.success) {
        // Filtrar apenas execuções que têm observações (problemas reportados)
        const problemsData = response.data.filter((execution: RouteExecution) => 
          execution.observations && execution.observations.trim() !== ''
        );
        setProblems(problemsData);
      }
    } catch (error) {
      console.error('Erro ao carregar problemas:', error);
      toast.error('Erro ao carregar problemas reportados');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente' },
      in_progress: { color: 'bg-blue-100 text-blue-800', text: 'Em Execução' },
      completed: { color: 'bg-green-100 text-green-800', text: 'Concluída' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelada' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = 
      problem.route?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.observations?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || problem.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-700 dark:to-orange-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <AlertTriangle className="h-8 w-8 mr-3" />
              Problemas Reportados
            </h1>
            <p className="mt-2 text-orange-100 dark:text-orange-200 text-lg">
              Acompanhe os problemas reportados pelos funcionários
            </p>
            <p className="mt-1 text-orange-200 dark:text-orange-300 text-sm">
              Total de {problems.length} problema{problems.length !== 1 ? 's' : ''} reportado{problems.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 dark:bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Rota, funcionário ou problema..."
              />
            </div>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status da Rota
            </label>
            <select
              id="status"
              name="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Execução</option>
              <option value="completed">Concluída</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={loadProblems}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Carregando problemas...</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="p-12 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              {problems.length === 0 ? 'Nenhum problema reportado' : 'Nenhum problema encontrado'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {problems.length === 0 
                ? 'Não há problemas reportados pelos funcionários no momento.'
                : 'Tente ajustar os filtros de busca.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProblems.map((problem) => (
              <div key={problem.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {problem.route?.name || 'Rota não encontrada'}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {problem.employee?.name || 'Funcionário não encontrado'}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDate(problem.updatedAt)}
                          </span>
                          {getStatusBadge(problem.status)}
                        </div>
                      </div>
                    </div>

                    {/* Route Details */}
                    {problem.route && (
                      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detalhes da Rota</h4>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              {problem.route.startPoint && problem.route.endPoint && (
                                <p><strong>Trajeto:</strong> {problem.route.startPoint} → {problem.route.endPoint}</p>
                              )}
                              {problem.route.scheduledDate && (
                                <p><strong>Data:</strong> {new Date(problem.route.scheduledDate).toLocaleDateString('pt-BR')}</p>
                              )}
                              {problem.route.shift && (
                                <p><strong>Turno:</strong> {formatShift(problem.route.shift)}</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Problema Reportado</h4>
                            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                              <p className="text-sm text-orange-800 dark:text-orange-200">
                                {problem.observations}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;
