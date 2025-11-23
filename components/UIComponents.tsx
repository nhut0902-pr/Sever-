import React from 'react';

// Card Wrapper with Glassmorphism and Blue Glow - Restored to Blue Theme
export const BlueCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-slate-900/70 backdrop-blur-md border border-blue-500/30 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.15)] p-6 text-blue-50 ${className}`}>
    {children}
  </div>
);

// Primary Action Button
export const BlueButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => (
  <button 
    className={`px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 border border-blue-400/20 ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Icon wrapper - Blue Background
export const IconBox: React.FC<{ icon: string; label: string; value: string | number; color?: string }> = ({ icon, label, value, color = 'text-blue-400' }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-slate-800/50 rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-colors group">
    <i className={`fa-solid ${icon} text-2xl mb-2 ${color} group-hover:scale-110 transition-transform`}></i>
    <span className="text-xs text-blue-300/80 uppercase tracking-wider">{label}</span>
    <span className="text-xl font-bold text-white mt-1 text-shadow-glow">{value}</span>
  </div>
);

// Avatar
export const Avatar: React.FC<{ src: string; size?: 'sm' | 'md' | 'lg' }> = ({ src, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-24 h-24'
    };
    
    return (
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-blue-500/30 shadow-[0_0_10px_rgba(37,99,235,0.3)]`}>
            <img src={src} alt="avatar" className="w-full h-full object-cover" />
        </div>
    );
};