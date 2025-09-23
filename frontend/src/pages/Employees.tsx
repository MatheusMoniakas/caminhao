import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AddEmployeeModal from '@/components/AddEmployeeModal';
import apiService from '@/services/api';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const Employees: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllEmployees();
      if (response.success) {
        setEmployees(response.data);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao carregar funcionários';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleEmployeeAdded = () => {
    loadEmployees();
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const employee = employees.find(emp => emp.id === id);
      const newStatus = employee?.isActive ? 'desativado' : 'ativado';
      
      const response = await apiService.toggleEmployeeStatus(id);
      if (response.success) {
        toast.success(`Funcionário ${newStatus} com sucesso!`);
        loadEmployees();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao atualizar status';
      toast.error(errorMessage);
    }
  };

  const handleDeleteEmployee = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o funcionário ${name}?`)) {
      try {
        const response = await apiService.deleteEmployee(id);
        if (response.success) {
          toast.success('Funcionário excluído com sucesso!');
          loadEmployees();
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Erro ao excluir funcionário';
        toast.error(errorMessage);
      }
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || 
                         (statusFilter === 'active' && employee.isActive) ||
                         (statusFilter === 'inactive' && !employee.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Funcionários</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerencie os funcionários do sistema
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Funcionário
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
                placeholder="Nome ou email"
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
              <option value="">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Lista de Funcionários
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Todos os funcionários cadastrados no sistema
          </p>
        </div>
        <div className="border-t border-gray-200">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Carregando funcionários...</div>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <p>Nenhum funcionário encontrado</p>
                <p className="text-sm mt-1">Adicione o primeiro funcionário para começar</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Função
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Criação
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className={`hover:bg-gray-50 ${!employee.isActive ? 'bg-gray-50 opacity-75' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.name}
                          </div>
                          {!employee.isActive && (
                            <span className="ml-2 text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                              DESATIVADO
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {employee.role === 'admin' ? 'Administrador' :
                           employee.role === 'driver' ? 'Motorista' : 'Funcionário'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            const action = employee.isActive ? 'desativar' : 'ativar';
                            const confirmMessage = `Tem certeza que deseja ${action} o funcionário ${employee.name}?`;
                            if (window.confirm(confirmMessage)) {
                              handleToggleStatus(employee.id);
                            }
                          }}
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
                            employee.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                              : 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-300'
                          }`}
                          title={employee.isActive ? 'Clique para desativar' : 'Clique para ativar'}
                        >
                          {employee.isActive ? '✅ Ativo' : '❌ Inativo'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(employee.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleDeleteEmployee(employee.id, employee.name)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir funcionário"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEmployeeAdded={handleEmployeeAdded}
      />
    </div>
  );
};

export default Employees;
