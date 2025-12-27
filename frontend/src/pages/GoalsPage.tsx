import React, { useState, useMemo } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useGoals } from '../services/goalsService';
import { useVisions } from '../services/visionService';
import { GoalCard } from '../components/GoalCard';
import { GoalFormDialog } from '../components/GoalFormDialog';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';
import type { Goal } from '../types';

const GoalsPage: React.FC = () => {
  const { data: goals = [], isLoading, error } = useGoals();
  const { data: visions = [] } = useVisions();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [filterVisionId, setFilterVisionId] = useState<number | null>(null);

  // Filter goals by selected vision
  const filteredGoals = useMemo(() => {
    if (!filterVisionId) return goals;
    return goals.filter((goal) => goal.vision === filterVisionId);
  }, [goals, filterVisionId]);

  // Separate high-level and low-level goals
  const { highLevelGoals, lowLevelGoals } = useMemo(() => {
    const high: Goal[] = [];
    const low: Goal[] = [];
    
    filteredGoals.forEach((goal) => {
      if (goal.strategic_level === 'high') {
        high.push(goal);
      } else {
        low.push(goal);
      }
    });
    
    return { highLevelGoals: high, lowLevelGoals: low };
  }, [filteredGoals]);

  const handleCreateGoal = () => {
    setSelectedGoal(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">⚠️</span>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Goals</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-16 px-8 shadow-xl overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center space-x-5 mb-4 animate-fade-in-up">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <span className="text-6xl">🎯</span>
              </div>
              <div>
                <h1 className="text-6xl font-bold mb-2">Strategic Goals</h1>
                <p className="text-green-100 text-xl font-medium">Track your specific, measurable milestones</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-2xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-16 px-8 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 opacity-50 animate-shimmer" style={{backgroundSize: '200% 100%'}}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-4 animate-fade-in-up">
            <div className="flex items-center space-x-5">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <span className="text-6xl">🎯</span>
              </div>
              <div>
                <h1 className="text-6xl font-bold mb-2">Strategic Goals</h1>
                <p className="text-green-100 text-xl font-medium">
                  Track your specific, measurable milestones
                </p>
                <p className="text-white/80 text-sm mt-1">
                  {filteredGoals.length} {filteredGoals.length === 1 ? 'goal' : 'goals'} 
                  {filterVisionId && ' (filtered)'}
                </p>
              </div>
            </div>
            <Button
              onClick={handleCreateGoal}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Goal
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Vision Filter */}
          {visions.length > 0 && (
            <div className="mb-8 overflow-x-auto pb-4">
              <div className="flex items-center space-x-3 min-w-max">
                <Filter className="h-5 w-5 text-gray-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-gray-700 flex-shrink-0">Filter by Vision:</span>
                <Button
                  variant={filterVisionId === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterVisionId(null)}
                  className="flex-shrink-0"
                >
                  All Goals ({goals.length})
                </Button>
                {visions.map((vision) => {
                  const visionGoalCount = goals.filter(g => g.vision === vision.id).length;
                  return (
                    <Button
                      key={vision.id}
                      variant={filterVisionId === vision.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterVisionId(vision.id)}
                      className="flex-shrink-0 max-w-xs"
                    >
                      <span className="truncate">{vision.yearly_theme}</span>
                      <Badge variant="secondary" className="ml-2">{visionGoalCount}</Badge>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredGoals.length === 0 ? (
            <div className="glass-effect rounded-3xl p-16 text-center shadow-2xl border-2 border-blue-100 animate-fade-in">
              <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-3xl mb-6 shadow-glow animate-bounce-slow">
                <span className="text-9xl">🎯</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                {filterVisionId ? 'No Goals for This Vision' : 'No Goals Yet'}
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                {filterVisionId 
                  ? 'Create your first goal for this vision to start tracking your progress.'
                  : 'Create your first goal to start tracking your progress.'}
              </p>
              <Button
                onClick={handleCreateGoal}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-2xl"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Goal
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* High-Level Goals Section */}
              {highLevelGoals.length > 0 && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg px-4 py-2 shadow-lg">
                      <span className="text-white font-bold">High-Level Strategic Goals</span>
                    </div>
                    <Badge variant="secondary">{highLevelGoals.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {highLevelGoals.map((goal, index) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        onEdit={handleEditGoal}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Low-Level Goals Section */}
              {lowLevelGoals.length > 0 && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg px-4 py-2 shadow-lg">
                      <span className="text-white font-bold">Low-Level Tactical Goals</span>
                    </div>
                    <Badge variant="secondary">{lowLevelGoals.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {lowLevelGoals.map((goal, index) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        onEdit={handleEditGoal}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <Button
        onClick={handleCreateGoal}
        size="lg"
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-3xl transition-all md:hidden"
      >
        <Plus className="h-8 w-8" />
      </Button>

      {/* Goal Form Dialog */}
      <GoalFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        goal={selectedGoal}
        mode={dialogMode}
      />
    </div>
  );
};

export default GoalsPage;
