import { useState, useEffect } from 'react';
import { Plus, Truck, Edit, Trash2, Eye } from 'lucide-react';
import { truckService } from '../services/api';
import toast from 'react-hot-toast';

export default function Trucks() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrucks();
  }, []);

  const loadTrucks = async () => {
    try {
      setLoading(true);
      const response = await truckService.getAll();
      setTrucks(response.data);
    } catch (error) {
      console.error('Erro ao carregar caminhões:', error);
      toast.error('Erro ao carregar caminhões');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Caminhões</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie a frota de caminhões da sua empresa
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Caminhão
        </button>
      </div>

      {/* Lista de caminhões */}
      <div className="card">
        <div className="card-body">
          {trucks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th>Placa</th>
                    <th>Modelo</th>
                    <th>Ano</th>
                    <th>Capacidade</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {trucks.map((truck) => (
                    <tr key={truck.id}>
                      <td className="font-medium">{truck.plate}</td>
                      <td>{truck.model}</td>
                      <td>{truck.year}</td>
                      <td>{truck.capacity}t</td>
                      <td>
                        <span className={`badge ${truck.isAvailable ? 'badge-success' : 'badge-danger'}`}>
                          {truck.isAvailable ? 'Disponível' : 'Indisponível'}
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
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum caminhão cadastrado</h3>
              <p className="text-gray-500 mb-4">Comece adicionando o primeiro caminhão da sua frota</p>
              <button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Caminhão
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


