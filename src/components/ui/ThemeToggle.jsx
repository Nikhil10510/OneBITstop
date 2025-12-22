import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex h-10 w-20 items-center rounded-full 
        transition-all duration-300 ease-in-out
        ${isDark 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25' 
          : 'bg-gradient-to-r from-gray-200 to-gray-300 shadow-md'
        }
        hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Toggle handle */}
      <div
        className={`
          absolute left-1 h-8 w-8 top-1 rounded-full bg-white shadow-lg
          transition-all duration-300 ease-in-out
          flex items-center justify-center
          ${isDark ? 'translate-x-10' : 'translate-x-0'}
        `}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-blue-600" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-500" />
        )}
      </div>
      
      {/* Background icons */}
      <div className="flex w-full justify-between px-2">
        <Sun className={`h-4 w-4 transition-colors duration-300 ${
          isDark ? 'text-white/60' : 'text-yellow-500'
        }`} />
        <Moon className={`h-4 w-4 transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-gray-400'
        }`} />
      </div>
    </button>
  );
};

export default ThemeToggle; 