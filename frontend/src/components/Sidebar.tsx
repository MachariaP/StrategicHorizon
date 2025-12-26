import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/app', icon: '📊' },
    { name: 'Vision & Theme', path: '/app/vision', icon: '🎯' },
    { name: 'Goals', path: '/app/goals', icon: '🎪' },
    { name: 'KPIs', path: '/app/kpis', icon: '📈' },
    { name: 'Non-Negotiables', path: '/app/non-negotiables', icon: '🛡️' },
    { name: 'Systems', path: '/app/systems', icon: '⚙️' },
    { name: 'People', path: '/app/people', icon: '👥' },
    { name: 'Executions', path: '/app/executions', icon: '📅' },
    { name: 'Obstacles', path: '/app/obstacles', icon: '🚧' },
    { name: 'Reflections', path: '/app/reflections', icon: '🤔' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  return (
    <div className="w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen p-6 flex flex-col shadow-2xl">
      <div className="mb-10">
        <div className="flex items-center justify-center mb-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-glow">
            <span className="text-4xl">🌟</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          Strategic Horizon
        </h1>
        <p className="text-xs text-center text-gray-400 mt-2 font-medium">2026 Planning</p>
      </div>
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'hover:bg-gray-800/70 hover:scale-102 hover:pl-6'
              }`}
            >
              <span className={`text-2xl transition-transform duration-300 ${
                isActive ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                {item.icon}
              </span>
              <span className={`text-sm font-medium transition-all ${
                isActive ? 'font-bold' : 'font-normal'
              }`}>
                {item.name}
              </span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 pt-6 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-red-600/90 transition-all duration-300 text-left group hover:scale-102"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">🚪</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
