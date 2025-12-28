// src/components/ConfidenceMatrix.tsx
import React from 'react';
import { useConfidenceMatrix } from '../services/goalsService';
import GlassCard from './GlassCard';
import type { Goal } from '../types';

const ConfidenceMatrix: React.FC = () => {
  const { data: matrixData, isLoading, error } = useConfidenceMatrix();

  if (isLoading) {
    return (
      <GlassCard>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard>
        <div className="text-center py-12">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-white mb-2">Unable to Load Matrix</h3>
          <p className="text-gray-400">Error loading confidence matrix data</p>
        </div>
      </GlassCard>
    );
  }

  if (!matrixData) {
    return (
      <GlassCard>
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-white mb-2">No Data Available</h3>
          <p className="text-gray-400">Create some goals to see the confidence matrix</p>
        </div>
      </GlassCard>
    );
  }

  const renderQuadrant = (
    title: string,
    description: string,
    goals: Goal[],
    color: string,
    icon: string
  ) => (
    <div className={`relative bg-gradient-to-br ${color} rounded-2xl p-6 border-2 border-white/20`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-300/80">{description}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
      
      <div className="mb-4">
        <div className="text-3xl font-bold text-white">{goals.length}</div>
        <div className="text-sm text-gray-300/80">
          {goals.length === 1 ? 'Goal' : 'Goals'}
        </div>
      </div>

      {goals.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
          {goals.slice(0, 5).map(goal => (
            <div 
              key={goal.id} 
              className="bg-black/20 rounded-lg p-3 backdrop-blur-sm border border-white/10"
            >
              <div className="text-sm font-semibold text-white mb-1 line-clamp-1">
                {goal.title}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-300/80">
                <span>Progress: {goal.progress_percentage}%</span>
                <span>Confidence: {goal.confidence_level}/5</span>
              </div>
            </div>
          ))}
          {goals.length > 5 && (
            <div className="text-xs text-center text-gray-300/60 pt-2">
              +{goals.length - 5} more
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <GlassCard>
      {/* Stats Summary */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30">
          <div className="text-2xl font-bold text-white">{matrixData.stats.total}</div>
          <div className="text-sm text-purple-300">Total Goals</div>
        </div>
        <div className="bg-red-500/20 rounded-xl p-4 border border-red-500/30">
          <div className="text-2xl font-bold text-white">{matrixData.stats.high_risk}</div>
          <div className="text-sm text-red-300">High Risk</div>
        </div>
        <div className="bg-yellow-500/20 rounded-xl p-4 border border-yellow-500/30">
          <div className="text-2xl font-bold text-white">{matrixData.stats.false_security}</div>
          <div className="text-sm text-yellow-300">False Security</div>
        </div>
        <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
          <div className="text-2xl font-bold text-white">{matrixData.stats.on_track}</div>
          <div className="text-sm text-green-300">On Track</div>
        </div>
        <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
          <div className="text-2xl font-bold text-white">{matrixData.stats.early_stage}</div>
          <div className="text-sm text-blue-300">Early Stage</div>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quadrant 2: False Security (High Progress, Low Confidence) */}
        {renderQuadrant(
          'False Security',
          'High progress, low confidence',
          matrixData.quadrant2,
          'from-yellow-600/40 to-orange-600/40',
          '⚠️'
        )}
        
        {/* Quadrant 1: On Track (High Progress, High Confidence) */}
        {renderQuadrant(
          'On Track',
          'High progress, high confidence',
          matrixData.quadrant1,
          'from-green-600/40 to-emerald-600/40',
          '✅'
        )}
        
        {/* Quadrant 3: High Risk (Low Progress, Low Confidence) */}
        {renderQuadrant(
          'High Risk',
          'Low progress, low confidence',
          matrixData.quadrant3,
          'from-red-600/40 to-rose-600/40',
          '🚨'
        )}
        
        {/* Quadrant 4: Early Stage (Low Progress, High Confidence) */}
        {renderQuadrant(
          'Early Stage',
          'Low progress, high confidence',
          matrixData.quadrant4,
          'from-blue-600/40 to-cyan-600/40',
          '🚀'
        )}
      </div>

      {/* Axis Labels */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-green-500 rounded mr-2"></div>
            <span>Progress: Low → High</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-blue-500 rounded mr-2"></div>
            <span>Confidence: Low → High</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default ConfidenceMatrix;
