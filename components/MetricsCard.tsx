import React from 'react';

interface MetricsCardProps {
  label: string;
  value: string | number;
  color: string;
  subtext: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ label, value, color, subtext }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-4xl font-light text-gray-800 mb-1">{value}</div>
      <div className="text-[11px] text-gray-400">{subtext}</div>
    </div>
  );
};

export default MetricsCard;
