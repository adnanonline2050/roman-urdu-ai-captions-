import React from 'react';

interface ToolbarProps {
  onAddText: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onAddText }) => {
  return (
    <div className="flex items-center gap-4">
      <h3 className="text-lg font-semibold text-dark">Editor Tools</h3>
      <div className="h-6 w-px bg-secondary"></div>
      <button 
        onClick={onAddText}
        className="px-3 py-1.5 bg-white text-dark font-semibold rounded-lg border border-secondary hover:bg-secondary transition-colors"
      >
        Add Text
      </button>
      <button 
        className="px-3 py-1.5 bg-white text-dark font-semibold rounded-lg border border-secondary hover:bg-secondary transition-colors"
      >
        Split
      </button>
    </div>
  );
};
