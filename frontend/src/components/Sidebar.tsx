import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Vision & Theme', path: '/vision', icon: '🎯' },
    { name: 'Goals', path: '/goals', icon: '🎪' },
    { name: 'KPIs', path: '/kpis', icon: '📈' },
    { name: 'Non-Negotiables', path: '/non-negotiables', icon: '🛡️' },
    { name: 'Systems', path: '/systems', icon: '⚙️' },
    { name: 'People', path: '/people', icon: '👥' },
    { name: 'Executions', path: '/executions', icon: '📅' },
    { name: 'Obstacles', path: '/obstacles', icon: '🚧' },
    { name: 'Reflections', path: '/reflections', icon: '🤔' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white min-h-screen p-4 flex flex-col shadow-2xl">
      <div className="mb-8 animate-fadeIn">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🎯</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Strategic Horizon</h1>
        <p className="text-xs text-center text-gray-400 mt-1">2026 Planning</p>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={item.path} className="animate-slideIn" style={{ animationDelay: `${index * 0.05}s` }}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'hover:bg-gray-800 hover:translate-x-1'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-600/20 hover:border hover:border-red-500 transition-all duration-200 text-left group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">🚪</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
