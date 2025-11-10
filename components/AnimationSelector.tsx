import React from 'react';
import type { AnimationStyle, AnimationTemplate } from '../types';

interface AnimationSelectorProps {
  templates: AnimationTemplate[];
  selectedStyle: AnimationStyle;
  onSelectStyle: (style: AnimationStyle) => void;
  isVideoLoaded: boolean;
}

export const AnimationSelector: React.FC<AnimationSelectorProps> = ({ templates, selectedStyle, onSelectStyle, isVideoLoaded }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-dark mb-4 text-center">Select Caption Animation</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectStyle(template.id)}
            disabled={!isVideoLoaded}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-light focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:transform-none ${
              selectedStyle === template.id
                ? 'bg-primary text-white shadow-md transform scale-105'
                : 'bg-white text-dark hover:bg-secondary border border-secondary'
            }`}
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
};
