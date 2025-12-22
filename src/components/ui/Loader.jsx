import React from 'react';

const Loader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 bg-opacity-80 backdrop-blur-sm transition-opacity animate-fade-in">
    <div className="relative w-20 h-20 flex items-center justify-center">
      <span className="absolute inline-flex h-full w-full rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-indigo-500 opacity-30 animate-pulse"></span>
      <svg className="animate-spin h-16 w-16 text-transparent" viewBox="0 0 50 50">
        <circle
          className="opacity-20"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
        />
        <circle
          className="text-blue-500 dark:text-purple-400"
          cx="25"
          cy="25"
          r="20"
          stroke="url(#loader-gradient)"
          strokeWidth="6"
          fill="none"
          strokeDasharray="90 150"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="loader-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
);

export default Loader; 