import React, { useEffect, useState } from 'react';
import { peopleAPI } from '../api';
import type { Person } from '../types';

const PeoplePage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await peopleAPI.getAll();
        setPeople(response.data.results || []);
      } catch (error) {
        console.error('Error fetching people:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getRoleColor = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('mentor')) return 'bg-gradient-to-r from-purple-500 to-pink-500';
    if (roleLower.includes('partner')) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    if (roleLower.includes('supporter')) return 'bg-gradient-to-r from-green-500 to-teal-500';
    return 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-600 mb-4"></div>
        <div className="text-xl text-gray-600 font-semibold">Loading people...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white py-16 px-8 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-50 animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center space-x-5 mb-4 animate-fade-in-up">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <span className="text-6xl">👥</span>
            </div>
            <div>
              <h1 className="text-6xl font-bold mb-2">People</h1>
              <p className="text-pink-100 text-xl font-medium">Your network of mentors, partners, and supporters</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {people.length === 0 ? (
            <div className="glass-effect rounded-3xl p-16 text-center shadow-2xl border-2 border-purple-100 animate-fade-in">
              <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 p-6 rounded-3xl mb-6 shadow-glow animate-bounce-slow">
                <span className="text-9xl">👥</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No People Added Yet</h3>
              <p className="text-gray-600 text-lg">Build your network by adding mentors and supporters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {people.map((person, index) => (
                <div 
                  key={person.id} 
                  className="glass-effect rounded-2xl p-6 shadow-xl border-2 border-purple-100 hover:shadow-2xl transition-all duration-300 card-hover animate-fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-start mb-4">
                    <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl p-4 mr-4 shadow-lg">
                      <span className="text-5xl">👤</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{person.name}</h3>
                      <span className={`inline-block ${getRoleColor(person.role)} text-white px-3 py-1 text-xs font-bold rounded-full shadow-md`}>
                        {person.role.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3 font-medium leading-relaxed">{person.role_description}</p>
                  {person.contact_info && (
                    <div className="flex items-center bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl px-4 py-2 mb-3">
                      <span className="text-lg mr-2">📧</span>
                      <p className="text-sm text-gray-700 font-medium">{person.contact_info}</p>
                    </div>
                  )}
                  {person.notes && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl px-4 py-3 mt-3">
                      <p className="text-sm text-gray-700 italic">&ldquo;{person.notes}&rdquo;</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeoplePage;
