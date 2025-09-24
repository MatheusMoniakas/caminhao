import React, { ReactNode, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Truck, 
  Users, 
  MapPin, 
  BarChart3, 
  LogOut, 
  Menu,
  X,
  Bell,
  Settings
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, adminOnly: true },
    { name: 'Funcionários', href: '/employees', icon: Users, adminOnly: true },
    { name: 'Rotas', href: '/routes', icon: MapPin, adminOnly: true },
    { name: 'Minhas Rotas', href: '/my-routes', icon: Truck, employeeOnly: true },
  ];

  const filteredNavigation = navigation.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') return false;
    if (item.employeeOnly && user?.role !== 'employee') return false;
    return true;
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-white shadow-2xl">
          <div className="flex h-20 items-center justify-between px-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-lg">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">FleetManager</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`group flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center p-3 rounded-xl bg-white shadow-sm">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                  <span className="text-sm font-semibold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrador' : 'Funcionário'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-xl border-r border-gray-100">
          <div className="flex h-20 items-center px-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-lg">
              <Truck className="h-7 w-7 text-blue-600" />
            </div>
            <span className="ml-4 text-2xl font-bold text-white">FleetManager</span>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`group flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center p-3 rounded-xl bg-white shadow-sm">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                  <span className="text-sm font-semibold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrador' : 'Funcionário'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/80 backdrop-blur-md px-6 shadow-sm sm:gap-x-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Settings */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
              
              {/* User info */}
              <div className="flex items-center gap-x-3">
                <div className="flex items-center gap-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                    <span className="text-xs font-semibold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrador' : 'Funcionário'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
