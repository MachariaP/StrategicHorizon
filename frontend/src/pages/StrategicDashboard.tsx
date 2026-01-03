import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { goalsAPI } from '../api';
import type { ConfidenceMatrixData, Goal } from '../types';

interface ScatterDataPoint {
  x: number;
  y: number;
  title: string;
  id: number | string;
  status: string;
}

const StrategicDashboard: React.FC = () => {
  const [matrixData, setMatrixData] = useState<ConfidenceMatrixData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatrixData = async () => {
      try {
        const response = await goalsAPI.getConfidenceMatrix();
        setMatrixData(response.data);
      } catch (error) {
        console.error('Error fetching confidence matrix:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatrixData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-600 mb-4"></div>
          <div className="text-xl text-gray-600 font-semibold">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  // Transform goals into scatter plot data
  const allGoals = matrixData ? [
    ...matrixData.quadrant1,
    ...matrixData.quadrant2,
    ...matrixData.quadrant3,
    ...matrixData.quadrant4,
  ] : [];

  const scatterData: ScatterDataPoint[] = allGoals.map((goal: Goal) => ({
    x: goal.progress_percentage,
    y: goal.confidence_level,
    title: goal.title,
    id: goal.id,
    status: goal.status,
  }));

  // Get color based on quadrant
  const getPointColor = (x: number, y: number) => {
    if (x >= 70 && y >= 4) return '#10b981'; // Green - On Track (Q1)
    if (x >= 70 && y <= 2) return '#ef4444'; // Red - False Security (Q2)
    if (x <= 30 && y >= 4) return '#f59e0b'; // Orange - Early Stage (Q3)
    if (x <= 30 && y <= 2) return '#dc2626'; // Dark Red - High Risk (Q4)
    return '#6b7280'; // Gray - Middle zone
  };

  // Custom tooltip component with explicit type definition
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: ScatterDataPoint;
    }>;
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-cyan-200">
          <p className="font-bold text-gray-900 mb-2">{data.title}</p>
          <p className="text-sm text-gray-600">Progress: {data.x.toFixed(1)}%</p>
          <p className="text-sm text-gray-600">Confidence: {data.y}/5</p>
          <p className="text-sm text-gray-600 capitalize">Status: {data.status}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white py-16 px-8 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 opacity-50 animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center space-x-5 mb-4 animate-fade-in-up">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <span className="text-6xl">📊</span>
            </div>
            <div>
              <h1 className="text-6xl font-bold mb-2">Strategic Dashboard</h1>
              <p className="text-cyan-100 text-xl font-medium">Confidence Matrix & Goal Analysis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-effect rounded-2xl p-6 shadow-xl border-2 border-green-100">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3">
                  <span className="text-3xl">✅</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">On Track</p>
                  <p className="text-3xl font-bold text-gray-900">{matrixData?.stats.on_track || 0}</p>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6 shadow-xl border-2 border-orange-100">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl p-3">
                  <span className="text-3xl">🌱</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Early Stage</p>
                  <p className="text-3xl font-bold text-gray-900">{matrixData?.stats.early_stage || 0}</p>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6 shadow-xl border-2 border-red-100">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-3">
                  <span className="text-3xl">⚠️</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">False Security</p>
                  <p className="text-3xl font-bold text-gray-900">{matrixData?.stats.false_security || 0}</p>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-6 shadow-xl border-2 border-red-200">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-3">
                  <span className="text-3xl">🚨</span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">High Risk</p>
                  <p className="text-3xl font-bold text-gray-900">{matrixData?.stats.high_risk || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Confidence Matrix Scatter Plot */}
          <div className="glass-effect rounded-2xl p-8 shadow-xl border-2 border-blue-100 mb-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Confidence vs Progress Matrix</h2>
              <p className="text-gray-600">Visualize your goals by confidence level and progress percentage</p>
            </div>

            {scatterData.length > 0 ? (
              <div className="h-[600px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 80, bottom: 60, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Progress" 
                      unit="%" 
                      domain={[0, 100]}
                      label={{ value: 'Progress Percentage', position: 'insideBottom', offset: -10, style: { fontWeight: 600 } }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Confidence" 
                      domain={[0, 6]}
                      ticks={[1, 2, 3, 4, 5]}
                      label={{ value: 'Confidence Level', angle: -90, position: 'insideLeft', style: { fontWeight: 600 } }}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="top" 
                      height={50}
                      content={() => (
                        <div className="flex justify-center space-x-6 mb-4 text-sm font-semibold">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            <span>On Track</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                            <span>Early Stage</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                            <span>False Security</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-red-700"></div>
                            <span>High Risk</span>
                          </div>
                        </div>
                      )}
                    />
                    <Scatter name="Goals" data={scatterData} fill="#8884d8">
                      {scatterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getPointColor(entry.x, entry.y)} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 p-6 rounded-3xl mb-6 shadow-glow">
                  <span className="text-8xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Goals to Display</h3>
                <p className="text-gray-600">Create goals with confidence levels to see the matrix.</p>
              </div>
            )}
          </div>

          {/* Quadrant Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quadrant 1: On Track */}
            <div className="glass-effect rounded-2xl p-6 shadow-xl border-2 border-green-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-2xl">✅</span>
                <span>On Track (High Progress, High Confidence)</span>
              </h3>
              <div className="space-y-3">
                {matrixData?.quadrant1.map((goal: Goal) => (
                  <div key={goal.id} className="bg-white/50 rounded-lg p-3 border border-green-200">
                    <p className="font-semibold text-gray-900">{goal.title}</p>
                    <p className="text-sm text-gray-600">Progress: {goal.progress_percentage}% | Confidence: {goal.confidence_level}/5</p>
                  </div>
                ))}
                {matrixData?.quadrant1.length === 0 && (
                  <p className="text-gray-500 italic">No goals in this quadrant</p>
                )}
              </div>
            </div>

            {/* Quadrant 3: Early Stage */}
            <div className="glass-effect rounded-2xl p-6 shadow-xl border-2 border-orange-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-2xl">🌱</span>
                <span>Early Stage (Low Progress, High Confidence)</span>
              </h3>
              <div className="space-y-3">
                {matrixData?.quadrant3.map((goal: Goal) => (
                  <div key={goal.id} className="bg-white/50 rounded-lg p-3 border border-orange-200">
                    <p className="font-semibold text-gray-900">{goal.title}</p>
                    <p className="text-sm text-gray-600">Progress: {goal.progress_percentage}% | Confidence: {goal.confidence_level}/5</p>
                  </div>
                ))}
                {matrixData?.quadrant3.length === 0 && (
                  <p className="text-gray-500 italic">No goals in this quadrant</p>
                )}
              </div>
            </div>

            {/* Quadrant 2: False Security */}
            <div className="glass-effect rounded-2xl p-6 shadow-xl border-2 border-red-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-2xl">⚠️</span>
                <span>False Security (High Progress, Low Confidence)</span>
              </h3>
              <div className="space-y-3">
                {matrixData?.quadrant2.map((goal: Goal) => (
                  <div key={goal.id} className="bg-white/50 rounded-lg p-3 border border-red-200">
                    <p className="font-semibold text-gray-900">{goal.title}</p>
                    <p className="text-sm text-gray-600">Progress: {goal.progress_percentage}% | Confidence: {goal.confidence_level}/5</p>
                  </div>
                ))}
                {matrixData?.quadrant2.length === 0 && (
                  <p className="text-gray-500 italic">No goals in this quadrant</p>
                )}
              </div>
            </div>

            {/* Quadrant 4: High Risk */}
            <div className="glass-effect rounded-2xl p-6 shadow-xl border-2 border-red-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-2xl">🚨</span>
                <span>High Risk (Low Progress, Low Confidence)</span>
              </h3>
              <div className="space-y-3">
                {matrixData?.quadrant4.map((goal: Goal) => (
                  <div key={goal.id} className="bg-white/50 rounded-lg p-3 border border-red-300">
                    <p className="font-semibold text-gray-900">{goal.title}</p>
                    <p className="text-sm text-gray-600">Progress: {goal.progress_percentage}% | Confidence: {goal.confidence_level}/5</p>
                  </div>
                ))}
                {matrixData?.quadrant4.length === 0 && (
                  <p className="text-gray-500 italic">No goals in this quadrant</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicDashboard;
