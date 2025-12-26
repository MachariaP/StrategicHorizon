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

  const getFrequencyColor = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'daily':
        return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'weekly':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'monthly':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600 mb-4"></div>
        <div className="text-xl text-gray-600 font-semibold">Loading non-negotiables...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white py-16 px-8 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 opacity-50 animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center space-x-5 mb-4 animate-fade-in-up">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <span className="text-6xl">🛡️</span>
            </div>
            <div>
              <h1 className="text-6xl font-bold mb-2">Non-Negotiables</h1>
              <p className="text-orange-100 text-xl font-medium">Your essential daily, weekly, and monthly boundaries</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {items.length === 0 ? (
            <div className="glass-effect rounded-3xl p-16 text-center shadow-2xl border-2 border-orange-100 animate-fade-in">
              <div className="inline-block bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-3xl mb-6 shadow-glow animate-bounce-slow">
                <span className="text-9xl">🛡️</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No Non-Negotiables Yet</h3>
              <p className="text-gray-600 text-lg">Define your essential boundaries to stay on track.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="glass-effect rounded-2xl p-6 shadow-xl border-2 border-orange-100 hover:shadow-2xl transition-all duration-300 card-hover animate-fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-3 shadow-lg">
                      <span className="text-3xl">⚖️</span>
                    </div>
                    <span className={`${getFrequencyColor(item.frequency)} text-white px-4 py-1.5 text-xs font-bold rounded-full shadow-md`}>
                      {item.frequency.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NonNegotiablesPage;
