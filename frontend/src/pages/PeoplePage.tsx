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

  if (loading) return <div className="p-8 flex justify-center items-center min-h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <div className="text-xl text-gray-600 font-medium">Loading...</div>
    </div>
  </div>;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 animate-fadeIn">People</h1>
        {people.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-xl border border-white/20">
            <span className="text-6xl mb-4 block animate-pulse">👥</span>
            <p className="text-gray-600 text-lg">No people added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {people.map((person, index) => (
              <div key={person.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 animate-fadeIn" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="flex items-start mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-3xl">👤</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{person.name}</h3>
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-purple-400 to-pink-500 text-white mt-2">
                      {person.role.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-3 leading-relaxed">{person.role_description}</p>
                {person.contact_info && (
                  <div className="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg mb-2">
                    <span className="mr-2">📧</span>
                    <span>{person.contact_info}</span>
                  </div>
                )}
                {person.notes && (
                  <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">{person.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PeoplePage;
