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

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">People</h1>
        {people.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <span className="text-6xl mb-4 block">👥</span>
            <p className="text-gray-600">No people added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {people.map((person) => (
              <div key={person.id} className="bg-white rounded-lg p-6 shadow">
                <div className="flex items-start mb-4">
                  <span className="text-4xl mr-4">👤</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{person.name}</h3>
                    <span className="inline-block px-2 py-1 text-xs rounded bg-purple-100 text-purple-800 mt-1">
                      {person.role.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{person.role_description}</p>
                {person.contact_info && (
                  <p className="text-sm text-gray-500 mb-2">📧 {person.contact_info}</p>
                )}
                {person.notes && (
                  <p className="text-sm text-gray-600 italic">{person.notes}</p>
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
