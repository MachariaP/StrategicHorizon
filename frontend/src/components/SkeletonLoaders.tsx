import React from 'react';
import { Skeleton } from './ui/skeleton';

/**
 * Custom skeleton loaders for different card types
 * These maintain the same structure as the actual cards to prevent layout shift
 */

export function GoalCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      {/* Title */}
      <Skeleton className="h-6 w-3/4" />
      
      {/* Status badge */}
      <Skeleton className="h-5 w-24 rounded-full" />
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      
      {/* Footer items */}
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function KPICardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      {/* Title */}
      <Skeleton className="h-6 w-2/3" />
      
      {/* Description */}
      <Skeleton className="h-4 w-full" />
      
      {/* Progress percentage */}
      <Skeleton className="h-8 w-16" />
      
      {/* Progress bar */}
      <Skeleton className="h-3 w-full rounded-full" />
      
      {/* Value */}
      <div className="flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function VisionCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
      {/* Year and theme */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-3/4" />
      </div>
      
      {/* North Star */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      
      {/* Stats */}
      <div className="flex space-x-4">
        <Skeleton className="h-16 w-32" />
        <Skeleton className="h-16 w-32" />
      </div>
    </div>
  );
}

export function ObstacleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      {/* Title and severity */}
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      
      {/* Mitigation */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

export function ExecutionCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      {/* Month and year */}
      <Skeleton className="h-7 w-40" />
      
      {/* Title */}
      <Skeleton className="h-6 w-3/4" />
      
      {/* Status */}
      <Skeleton className="h-5 w-24 rounded-full" />
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      
      {/* Footer */}
      <Skeleton className="h-4 w-28" />
    </div>
  );
}

export function PersonCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      {/* Avatar and name */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      
      {/* Role description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      
      {/* Contact info */}
      <Skeleton className="h-4 w-1/2" />
      
      {/* Footer */}
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

export function SystemCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      {/* Name and health status */}
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      
      {/* Frequency */}
      <Skeleton className="h-5 w-32" />
      
      {/* Last execution */}
      <Skeleton className="h-4 w-40" />
      
      {/* Footer */}
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function NonNegotiableCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      {/* Title and frequency */}
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

export function ReflectionCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
      {/* Title */}
      <Skeleton className="h-7 w-48" />
      
      {/* Wins */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      
      {/* Challenges */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      
      {/* Lessons */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}
