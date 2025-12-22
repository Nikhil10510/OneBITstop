import React from 'react';

const FormLoader = ({ message = "Adding item, please wait..." }) => (
  <div className="fixed inset-0 flex flex-col justify-center items-center bg-black/50 backdrop-blur-sm z-50">
    <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl p-8 shadow-2xl border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-md">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute w-full h-full border-4 border-t-transparent border-cyan-400 rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-t-transparent border-indigo-400 rounded-full animate-spin-slow" />
        </div>
        <p className="text-gray-800 dark:text-gray-200 text-lg font-semibold text-center">
          {message}
        </p>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  </div>
);

export default FormLoader; 