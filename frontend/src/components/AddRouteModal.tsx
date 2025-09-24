import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import apiService from '@/services/api';

interface AddRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRouteCreated: () => void;
}

interface RouteFormData {
  name: string;
  description: string;
  startPoint: string;
  endPoint: string;
  waypoints: string[];
  driverId: string;
  helperId: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const AddRouteModal: React.FC<AddRouteModalProps> = ({
  isOpen,
  onClose,
  onRouteCreated
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [waypoints, setWaypoints] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<RouteFormData>();

  useEffect(() => {
    if (isOpen) {
      loadEmployees();
    }
  }, [isOpen]);

  const loadEmployees = async () => {
    try {
      const response = await apiService.getAllEmployees();
      if (response.success) {
        setEmployees(response.data.filter((emp: Employee) => emp.isActive));
      }
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      toast.error('Erro ao carregar funcionários');
    }
  };

  const addWaypoint = () => {
    setWaypoints([...waypoints, '']);
  };

  const removeWaypoint = (index: number) => {
    const newWaypoints = waypoints.filter((_, i) => i !== index);
    setWaypoints(newWaypoints);
    setValue('waypoints', newWaypoints);
  };

  const updateWaypoint = (index: number, value: string) => {
    const newWaypoints = [...waypoints];
    newWaypoints[index] = value;
    setWaypoints(newWaypoints);
    setValue('waypoints', newWaypoints);
  };

  const onSubmit = async (data: RouteFormData) => {
    setLoading(true);
    try {
      // Filtrar waypoints vazios e garantir que temos pelo menos um array
      const filteredWaypoints = waypoints.filter(wp => wp.trim() !== '');
      
      const routeData = {
        name: data.name,
        description: data.description || undefined,
        startPoint: data.startPoint || undefined,
        endPoint: data.endPoint || undefined,
        waypoints: filteredWaypoints.length > 0 ? filteredWaypoints : undefined,
        driverId: data.driverId,
        helperId: data.helperId || undefined
      };

      console.log('Dados da rota sendo enviados:', routeData);

      const response = await apiService.createRoute(routeData);
      
      if (response.success) {
        toast.success('Rota criada com sucesso!');
        reset();
        setWaypoints([]);
        onRouteCreated();
        onClose();
      } else {
        toast.error(response.error || 'Erro ao criar rota');
      }
    } catch (error: any) {
      console.error('Erro ao criar rota:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao criar rota';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Nova Rota
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Nome da Rota */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome da Rota *
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { 
                  required: 'Nome da rota é obrigatório',
                  minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Ex: Rota Centro - Zona Sul"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descrição
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Descrição da rota (opcional)"
              />
            </div>

            {/* Ponto de Partida */}
            <div>
              <label htmlFor="startPoint" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ponto de Partida
              </label>
              <input
                type="text"
                id="startPoint"
                {...register('startPoint')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Ex: Centro da Cidade (opcional)"
              />
            </div>

            {/* Ponto de Destino */}
            <div>
              <label htmlFor="endPoint" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ponto de Destino
              </label>
              <input
                type="text"
                id="endPoint"
                {...register('endPoint')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Ex: Zona Sul (opcional)"
              />
            </div>

            {/* Pontos de Parada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pontos de Parada (opcional)
              </label>
              {waypoints.length === 0 ? (
                <div className="text-sm text-gray-500 mb-2">
                  Nenhum ponto de parada adicionado. Clique em "Adicionar Ponto" para incluir paradas na rota.
                </div>
              ) : (
                waypoints.map((waypoint, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={waypoint}
                      onChange={(e) => updateWaypoint(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder={`Ponto de parada ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeWaypoint(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
              <button
                type="button"
                onClick={addWaypoint}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Ponto
              </button>
            </div>

            {/* Motorista */}
            <div>
              <label htmlFor="driverId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Motorista *
              </label>
              <select
                id="driverId"
                {...register('driverId', { 
                  required: 'Motorista é obrigatório'
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">Selecione o motorista</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.role})
                  </option>
                ))}
              </select>
              {errors.driverId && (
                <p className="mt-1 text-sm text-red-600">{errors.driverId.message}</p>
              )}
            </div>

            {/* Ajudante */}
            <div>
              <label htmlFor="helperId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ajudante
              </label>
              <select
                id="helperId"
                {...register('helperId')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">Selecione um ajudante (opcional)</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando...' : 'Criar Rota'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRouteModal;
