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
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center">Strategic Horizon</h1>
        <p className="text-xs text-center text-gray-400 mt-1">2026 Planning</p>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800'
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
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
        >
          <span className="text-xl">🚪</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
