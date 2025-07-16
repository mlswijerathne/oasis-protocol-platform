import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-dark-400 flex items-center justify-center z-50">
      <div className="cyber-card p-8 text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-cyber-green/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-cyber-green border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-cyber-green font-cyber text-lg glitch" data-text="LOADING...">
          LOADING...
        </div>
        <div className="text-sm text-gray-400 mt-2">
          Initializing OASIS Protocol...
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
