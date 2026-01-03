// src/components/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/app', icon: '📊', color: 'from-blue-500 to-cyan-500' },
    { name: 'Vision & Theme', path: '/app/vision', icon: '🎯', color: 'from-purple-500 to-pink-500' },
    { name: 'Goals', path: '/app/goals', icon: '🎪', color: 'from-green-500 to-emerald-500' },
    { name: 'KPIs', path: '/app/kpis', icon: '📈', color: 'from-yellow-500 to-orange-500' },
    { name: 'Strategic Dashboard', path: '/app/strategic-dashboard', icon: '🎯', color: 'from-cyan-500 to-blue-500' },
    { name: 'Non-Negotiables', path: '/app/non-negotiables', icon: '🛡️', color: 'from-red-500 to-rose-500' },
    { name: 'Systems', path: '/app/systems', icon: '⚙️', color: 'from-indigo-500 to-blue-500' },
    { name: 'People', path: '/app/people', icon: '👥', color: 'from-teal-500 to-cyan-500' },
    { name: 'Executions', path: '/app/executions', icon: '🚀', color: 'from-pink-500 to-rose-500' },
    { name: 'Obstacles', path: '/app/obstacles', icon: '🚧', color: 'from-amber-500 to-orange-500' },
    { name: 'Reflections', path: '/app/reflections', icon: '🤔', color: 'from-violet-500 to-purple-500' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  return (
    <div className="w-72 min-h-screen p-6 flex flex-col backdrop-blur-xl bg-gradient-to-b from-gray-900/90 to-gray-800/90 border-r border-white/10">
      {/* Logo Section */}
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-70 animate-pulse" />
            <div className="relative text-4xl">🌟</div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
              Strategic Horizon
            </h1>
            <p className="text-xs text-purple-300/70 mt-1">2026 Planning Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    relative
                    flex items-center space-x-4
                    px-6 py-4
                    rounded-2xl
                    transition-all duration-300
                    group
                    ${isActive 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full animate-pulse" />
                  )}
                  
                  {/* Icon */}
                  <div className={`
                    relative
                    text-2xl
                    transition-transform duration-300
                    ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-12'}
                  `}>
                    {item.icon}
                  </div>
                  
                  {/* Text */}
                  <span className="text-sm font-medium tracking-wide">
                    {item.name}
                  </span>
                  
                  {/* Hover arrow */}
                  <div className={`
                    absolute right-4
                    opacity-0 group-hover:opacity-100
                    transition-all duration-300
                    ${isActive ? 'opacity-100' : ''}
                  `}>
                    <span className="text-lg">→</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User & Logout Section */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="mb-4 p-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-50" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Welcome back!</p>
              <p className="text-xs text-purple-300/70">Ready to conquer 2026</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="
            w-full
            flex items-center justify-center space-x-3
            px-6 py-4
            rounded-2xl
            bg-gradient-to-r from-gray-800/50 to-gray-900/50
            backdrop-blur-sm
            border border-white/10
            text-gray-300
            hover:text-white hover:bg-white/5
            transition-all duration-300
            group
          "
        >
          <span className="text-xl transition-transform group-hover:-translate-x-1">←</span>
          <span className="text-sm font-medium">Logout</span>
          <span className="text-xl transition-transform group-hover:translate-x-1">🚪</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;