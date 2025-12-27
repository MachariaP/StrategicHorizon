import React from 'react';
import { useVisions } from '../services/visionService';
import { Sparkles } from 'lucide-react';

/**
 * North Star Bar - A persistent bar showing the current active vision
 * Displays at the top of every page for constant reminder of the yearly theme
 */
export function NorthStarBar() {
  const { data: visions = [], isLoading } = useVisions();
  
  // Get the active vision or the most recent one
  const activeVision = visions.find(v => v.is_active) || visions[0];
  
  if (isLoading || !activeVision) {
    return null; // Don't show anything while loading or if no vision exists
  }
  
  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white py-2 px-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-sm uppercase tracking-wide">
              {activeVision.year} Theme:
            </span>
            <span className="text-lg font-bold">
              {activeVision.yearly_theme}
            </span>
          </div>
        </div>
        
        {/* Optional: Show health score if available */}
        {activeVision.health_score !== undefined && (
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <span className="opacity-90">Vision Health:</span>
            <span className="font-semibold bg-white/20 px-3 py-1 rounded-full">
              {Math.round(activeVision.health_score)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
