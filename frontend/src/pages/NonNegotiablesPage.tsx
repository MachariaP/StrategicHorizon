import React, { useEffect, useState } from 'react';
import { nonNegotiablesAPI } from '../api';
import type { NonNegotiable } from '../types';

const NonNegotiablesPage: React.FC = () => {
  const [items, setItems] = useState<NonNegotiable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await nonNegotiablesAPI.getAll();
        setItems(response.data.results || []);
      } catch (error) {
        console.error('Error fetching non-negotiables:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 flex justify-center items-center min-h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <div className="text-xl text-gray-600 font-medium">Loading...</div>
    </div>
  </div>;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 animate-fadeIn">Non-Negotiables</h1>
        {items.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-xl border border-white/20">
            <span className="text-6xl mb-4 block animate-pulse">🛡️</span>
            <p className="text-gray-600 text-lg">No non-negotiables created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">🛡️</span>
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    item.frequency === 'daily' 
                      ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                      : item.frequency === 'weekly'
                      ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white'
                      : 'bg-gradient-to-r from-green-400 to-green-600 text-white'
                  }`}>
                    {item.frequency.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NonNegotiablesPage;
