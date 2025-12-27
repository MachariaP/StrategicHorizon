import React from 'react';

interface ProgressCircleProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  size = 60,
  strokeWidth = 4,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all duration-500 ${
            value >= 75
              ? 'text-emerald-500'
              : value >= 50
              ? 'text-blue-500'
              : value >= 25
              ? 'text-yellow-500'
              : 'text-gray-400'
          }`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-bold text-gray-700">
        {Math.round(value)}%
      </span>
    </div>
  );
};
