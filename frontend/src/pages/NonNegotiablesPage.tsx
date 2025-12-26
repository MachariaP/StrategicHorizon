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
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching non-negotiables:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Non-Negotiables</h1>
        {items.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <span className="text-6xl mb-4 block">🛡️</span>
            <p className="text-gray-600">No non-negotiables created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-6 shadow">
                <span className="inline-block px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mb-3">
                  {item.frequency.toUpperCase()}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NonNegotiablesPage;
