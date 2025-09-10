import { useState, useEffect } from 'react';
import { Plus, Users, Edit, Trash2, Eye, UserCheck } from 'lucide-react';
import { employeeService } from '../services/api';
import toast from 'react-hot-toast';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadEmployees();
  }, [filter]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const functionType = filter === 'all' ? undefined : filter;
      const response = await employeeService.getAll(functionType);
      setEmployees(response.data);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      toast.error('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  const getFunctionLabel = (func) => {
    const labels = {
      DRIVER: 'Motorista',
      HELPER: 'Ajudante'
    };
    return labels[func] || func;
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
          <h1 className="text-2xl font-bold text-gray-900">Funcionários</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie motoristas e ajudantes da sua empresa
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Funcionário
        </button>
      </div>

      {/* Filtros */}
      <div className="flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('DRIVER')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filter === 'DRIVER'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Motoristas
        </button>
        <button
          onClick={() => setFilter('HELPER')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filter === 'HELPER'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Ajudantes
        </button>
      </div>

      {/* Lista de funcionários */}
      <div className="card">
        <div className="card-body">
          {employees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th>Nome</th>
                    <th>Função</th>
                    <th>CPF</th>
                    <th>Telefone</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="font-medium">{employee.name}</td>
                      <td>
                        <span className={`badge ${
                          employee.function === 'DRIVER' ? 'badge-info' : 'badge-warning'
                        }`}>
                          {getFunctionLabel(employee.function)}
                        </span>
                      </td>
                      <td>{employee.cpf}</td>
                      <td>{employee.phone || '-'}</td>
                      <td>
                        <span className={`badge ${employee.isAvailable ? 'badge-success' : 'badge-danger'}`}>
                          {employee.isAvailable ? 'Disponível' : 'Indisponível'}
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
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' 
                  ? 'Nenhum funcionário cadastrado'
                  : filter === 'DRIVER'
                  ? 'Nenhum motorista cadastrado'
                  : 'Nenhum ajudante cadastrado'
                }
              </h3>
              <p className="text-gray-500 mb-4">
                {filter === 'all'
                  ? 'Comece adicionando motoristas e ajudantes'
                  : `Comece adicionando ${filter === 'DRIVER' ? 'motoristas' : 'ajudantes'}`
                }
              </p>
              <button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Funcionário
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



