import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
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

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center">2026 Strategic Planner</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
