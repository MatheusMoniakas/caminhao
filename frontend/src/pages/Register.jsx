import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Truck, Eye, EyeOff, Building2, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [showPasswords, setShowPasswords] = useState({
    company: false,
    user: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const companyPassword = watch('companyPassword');
  const userPassword = watch('userPassword');

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const companyData = {
        name: data.companyName,
        cnpj: data.companyCnpj,
        email: data.companyEmail,
        password: data.companyPassword,
        address: data.companyAddress,
        phone: data.companyPhone
      };

      const userData = {
        name: data.userName,
        email: data.userEmail,
        password: data.userPassword
      };

      const result = await signUp(companyData, userData);
      
      if (result.success) {
        toast.success('Empresa e usuário criados com sucesso!');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-600">
            <Truck className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Criar nova conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              faça login na sua conta existente
            </Link>
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          {/* Dados da Empresa */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Dados da Empresa</h3>
              </div>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Nome da Empresa *
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    className={`mt-1 input ${errors.companyName ? 'input-error' : ''}`}
                    placeholder="Nome da sua empresa"
                    {...register('companyName', {
                      required: 'Nome da empresa é obrigatório'
                    })}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-danger-600">{errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="companyCnpj" className="block text-sm font-medium text-gray-700">
                    CNPJ *
                  </label>
                  <input
                    id="companyCnpj"
                    type="text"
                    className={`mt-1 input ${errors.companyCnpj ? 'input-error' : ''}`}
                    placeholder="00.000.000/0000-00"
                    {...register('companyCnpj', {
                      required: 'CNPJ é obrigatório'
                    })}
                  />
                  {errors.companyCnpj && (
                    <p className="mt-1 text-sm text-danger-600">{errors.companyCnpj.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700">
                  Email da Empresa *
                </label>
                <input
                  id="companyEmail"
                  type="email"
                  className={`mt-1 input ${errors.companyEmail ? 'input-error' : ''}`}
                  placeholder="empresa@email.com"
                  {...register('companyEmail', {
                    required: 'Email da empresa é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                />
                {errors.companyEmail && (
                  <p className="mt-1 text-sm text-danger-600">{errors.companyEmail.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyPassword" className="block text-sm font-medium text-gray-700">
                    Senha da Empresa *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="companyPassword"
                      type={showPasswords.company ? 'text' : 'password'}
                      className={`input pr-10 ${errors.companyPassword ? 'input-error' : ''}`}
                      placeholder="••••••••"
                      {...register('companyPassword', {
                        required: 'Senha da empresa é obrigatória',
                        minLength: {
                          value: 6,
                          message: 'Senha deve ter pelo menos 6 caracteres'
                        }
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility('company')}
                    >
                      {showPasswords.company ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.companyPassword && (
                    <p className="mt-1 text-sm text-danger-600">{errors.companyPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700">
                    Telefone
                  </label>
                  <input
                    id="companyPhone"
                    type="tel"
                    className="mt-1 input"
                    placeholder="(11) 99999-9999"
                    {...register('companyPhone')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700">
                  Endereço
                </label>
                <input
                  id="companyAddress"
                  type="text"
                  className="mt-1 input"
                  placeholder="Endereço completo"
                  {...register('companyAddress')}
                />
              </div>
            </div>
          </div>

          {/* Dados do Usuário Administrador */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center">
                <User className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Usuário Administrador</h3>
              </div>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                    Nome Completo *
                  </label>
                  <input
                    id="userName"
                    type="text"
                    className={`mt-1 input ${errors.userName ? 'input-error' : ''}`}
                    placeholder="Seu nome completo"
                    {...register('userName', {
                      required: 'Nome do usuário é obrigatório'
                    })}
                  />
                  {errors.userName && (
                    <p className="mt-1 text-sm text-danger-600">{errors.userName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">
                    Email Pessoal *
                  </label>
                  <input
                    id="userEmail"
                    type="email"
                    className={`mt-1 input ${errors.userEmail ? 'input-error' : ''}`}
                    placeholder="seu@email.com"
                    {...register('userEmail', {
                      required: 'Email do usuário é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
                  />
                  {errors.userEmail && (
                    <p className="mt-1 text-sm text-danger-600">{errors.userEmail.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700">
                  Senha Pessoal *
                </label>
                <div className="mt-1 relative">
                  <input
                    id="userPassword"
                    type={showPasswords.user ? 'text' : 'password'}
                    className={`input pr-10 ${errors.userPassword ? 'input-error' : ''}`}
                    placeholder="••••••••"
                    {...register('userPassword', {
                      required: 'Senha do usuário é obrigatória',
                      minLength: {
                        value: 6,
                        message: 'Senha deve ter pelo menos 6 caracteres'
                      }
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('user')}
                  >
                    {showPasswords.user ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.userPassword && (
                  <p className="mt-1 text-sm text-danger-600">{errors.userPassword.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-base font-medium"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Criar Conta'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

