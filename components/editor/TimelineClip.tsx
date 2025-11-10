import React from 'react';
import type { EditorClip } from '../../types';
import { ClipType } from '../../types';

interface TimelineClipProps {
  clip: EditorClip;
  isSelected: boolean;
  onSelect: () => void;
}

export const TimelineClip: React.FC<TimelineClipProps> = ({ clip, isSelected, onSelect }) => {
  const style: React.CSSProperties = {
    left: `${clip.start * 10}%`, // Example scaling
    width: `${clip.duration * 10}%`, // Example scaling
  };

  const getBackgroundColor = () => {
    if (clip.type === ClipType.Video) return 'bg-orange-200 border-orange-400';
    if (clip.type === ClipType.Text) return 'bg-indigo-200 border-indigo-400';
    return 'bg-slate-200 border-slate-400';
  }

  return (
    <div
      onClick={onSelect}
      style={style}
      className={`absolute h-12 rounded-md cursor-pointer border-2 transition-all ${getBackgroundColor()} ${isSelected ? 'border-primary shadow-lg' : 'hover:border-accent'}`}
    >
      <div className="p-1 text-xs text-dark truncate">
        {clip.type === ClipType.Text ? clip.content : 'Video Clip'}
      </div>
    </div>
  );
};
