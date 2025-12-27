import React from 'react';
import { Goal } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ProgressCircle } from './ProgressCircle';
import { useUpdateGoal } from '../services/goalsService';
import { useToast } from '../hooks/use-toast';
import { AlertTriangle, Edit2, Target, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { differenceInDays, isPast } from 'date-fns';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  index: number;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, index }) => {
  const { toast } = useToast();
  const updateGoal = useUpdateGoal();

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateGoal.mutateAsync({
        id: goal.id,
        data: { status: newStatus as any },
      });
      toast({
        title: 'Status Updated',
        description: `Goal status changed to ${newStatus.replace('_', ' ')}`,
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!goal.target_date) return null;
    const targetDate = new Date(goal.target_date);
    const today = new Date();
    const days = differenceInDays(targetDate, today);
    return { days, isOverdue: isPast(targetDate) && days < 0 };
  };

  const daysInfo = getDaysRemaining();

  // Get confidence color
  const getConfidenceColor = () => {
    const level = goal.confidence_level;
    if (level === 5) return 'from-emerald-500 to-green-500';
    if (level === 4) return 'from-green-500 to-emerald-400';
    if (level === 3) return 'from-blue-500 to-cyan-500';
    if (level === 2) return 'from-orange-500 to-yellow-500';
    return 'from-slate-400 to-gray-500';
  };

  const getConfidenceBorder = () => {
    const level = goal.confidence_level;
    if (level === 5) return 'border-emerald-500 shadow-emerald-200';
    if (level === 4) return 'border-green-500 shadow-green-200';
    if (level === 3) return 'border-blue-500 shadow-blue-200';
    if (level === 2) return 'border-orange-500 shadow-orange-200';
    return 'border-slate-400 shadow-slate-200';
  };

  // Get status badge color
  const getStatusColor = () => {
    switch (goal.status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'in_progress':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'stalled':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white';
    }
  };

  // Get days remaining color
  const getDaysColor = () => {
    if (!daysInfo) return 'text-gray-600';
    if (daysInfo.isOverdue) return 'text-red-600 font-bold';
    if (daysInfo.days <= 14) return 'text-yellow-600 font-bold';
    if (daysInfo.days <= 30) return 'text-yellow-500';
    return 'text-green-600';
  };

  const isHighLevel = goal.strategic_level === 'high';
  const isStalled = goal.status === 'stalled';

  return (
    <div
      className={`
        glass-effect rounded-2xl p-6 shadow-xl border-2 
        ${getConfidenceBorder()}
        hover:shadow-2xl transition-all duration-300 card-hover 
        ${isHighLevel ? 'md:col-span-2 lg:col-span-2' : ''}
        ${isStalled ? 'ring-2 ring-amber-400 ring-offset-2' : ''}
        animate-fade-in-up
      `}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Header with Icon, Status, and Edit */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`bg-gradient-to-br ${getConfidenceColor()} rounded-xl p-4 shadow-lg`}>
            <span className="text-4xl">
              {isHighLevel ? '🎯' : '🎪'}
            </span>
          </div>
          {isHighLevel && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              Strategic
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-4 py-1.5 text-xs font-bold rounded-full shadow-md ${getStatusColor()}`}>
            {goal.status.replace('_', ' ').toUpperCase()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(goal)}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Title and Description */}
      <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 ${isHighLevel ? 'text-3xl' : 'text-2xl'}`}>
        {goal.title}
      </h3>
      <p className={`text-gray-600 mb-5 leading-relaxed ${isHighLevel ? 'line-clamp-4' : 'line-clamp-3'}`}>
        {goal.description}
      </p>

      {/* Stats Row */}
      <div className="flex items-center space-x-4 mb-4">
        {/* Progress Circle */}
        <div className="flex items-center space-x-2">
          <ProgressCircle value={goal.progress_percentage} size={50} strokeWidth={4} />
          <span className="text-xs text-gray-600">Progress</span>
        </div>

        {/* KPI Count Badge */}
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
          <Target className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-bold text-blue-600">{goal.kpi_count} KPIs</span>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-lg">
          <TrendingUp className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-bold text-purple-600">
            {goal.confidence_level}/5
          </span>
        </div>
      </div>

      {/* Target Date and Days Remaining */}
      {goal.target_date && (
        <div className={`flex items-center text-sm mb-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4 py-3 border ${daysInfo?.isOverdue ? 'border-red-200' : 'border-blue-200'} shadow-sm`}>
          <Calendar className="mr-2 h-4 w-4 text-gray-700" />
          <span className="font-bold text-gray-700">Target: {new Date(goal.target_date).toLocaleDateString()}</span>
          {daysInfo && (
            <span className={`ml-auto ${getDaysColor()}`}>
              {daysInfo.isOverdue
                ? `Overdue by ${Math.abs(daysInfo.days)} days`
                : `${daysInfo.days} days remaining`}
            </span>
          )}
        </div>
      )}

      {/* Vision Link */}
      {goal.vision_details && (
        <div className="text-xs text-gray-500 italic mb-4 border-l-2 border-purple-300 pl-3">
          Supports: {goal.vision_details.north_star.substring(0, 60)}...
        </div>
      )}

      {/* At Risk Alert for Stalled Goals */}
      {isStalled && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 animate-pulse" />
            <span className="font-bold text-amber-800">At Risk</span>
          </div>
          <p className="text-sm text-amber-700 mb-2">
            This goal is stalled. Identify and address obstacles to get back on track.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-amber-400 text-amber-700 hover:bg-amber-100"
            onClick={() => {
              // Navigate to obstacles page with this goal pre-selected
              window.location.href = `/app/obstacles?goal=${goal.id}`;
            }}
          >
            Identify Obstacle
          </Button>
        </div>
      )}

      {/* Quick Status Update */}
      <div className="border-t pt-4">
        <label className="text-xs text-gray-600 mb-2 block">Quick Status Update:</label>
        <Select value={goal.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="stalled">Stalled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
