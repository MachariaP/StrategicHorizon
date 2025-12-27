import React from 'react';
import { Button } from './ui/button';
import { LucideIcon } from 'lucide-react';

interface ZeroStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'success' | 'info';
}

/**
 * Zero State Component - Professional empty state design
 * Displays when there's no data with a clear call-to-action
 */
export function ZeroState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
}: ZeroStateProps) {
  const variantStyles = {
    default: {
      container: 'bg-gradient-to-br from-gray-50 to-gray-100',
      icon: 'text-gray-400',
      button: 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700',
    },
    success: {
      container: 'bg-gradient-to-br from-green-50 to-blue-50',
      icon: 'text-green-500',
      button: 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700',
    },
    info: {
      container: 'bg-gradient-to-br from-blue-50 to-purple-50',
      icon: 'text-blue-500',
      button: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`min-h-[400px] rounded-3xl ${styles.container} flex items-center justify-center p-8`}>
      <div className="text-center max-w-md space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-white rounded-full p-6 shadow-lg">
            <Icon className={`w-16 h-16 ${styles.icon}`} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>

        {/* Description */}
        <p className="text-gray-600 text-lg leading-relaxed">{description}</p>

        {/* Action Button */}
        {actionLabel && onAction && (
          <div className="pt-4">
            <Button
              onClick={onAction}
              className={`${styles.button} text-white px-8 py-3 text-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105`}
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Pre-configured zero states for common scenarios
 */

export function NoGoalsZeroState({ onCreateGoal }: { onCreateGoal: () => void }) {
  return (
    <ZeroState
      icon={require('lucide-react').Target}
      title="No Goals Yet"
      description="Start your strategic journey by creating your first goal. Transform your vision into measurable milestones."
      actionLabel="Create Your First Goal"
      onAction={onCreateGoal}
      variant="default"
    />
  );
}

export function NoObstaclesZeroState({ onAddObstacle }: { onAddObstacle?: () => void }) {
  return (
    <ZeroState
      icon={require('lucide-react').ShieldCheck}
      title="Sailing in Clear Waters!"
      description="No obstacles found. Your path looks clear, but it's always good to anticipate potential challenges."
      actionLabel={onAddObstacle ? "Add Potential Obstacle" : undefined}
      onAction={onAddObstacle}
      variant="success"
    />
  );
}

export function NoKPIsZeroState({ onCreateKPI }: { onCreateKPI: () => void }) {
  return (
    <ZeroState
      icon={require('lucide-react').TrendingUp}
      title="No KPIs Defined"
      description="Key Performance Indicators help you track progress towards your goals. Start measuring what matters."
      actionLabel="Add Your First KPI"
      onAction={onCreateKPI}
      variant="info"
    />
  );
}
