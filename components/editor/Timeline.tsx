import React from 'react';
import type { EditorTrack, EditorClip } from '../../types';
import { TimelineClip } from './TimelineClip';

interface TimelineProps {
  tracks: EditorTrack[];
  selectedClipId: string | null;
  onSelectClip: (id: string | null) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ tracks, selectedClipId, onSelectClip }) => {
  return (
    <div className="w-full space-y-2 p-2 bg-secondary rounded-lg">
        <div className="text-dark font-mono text-xs">Timeline</div>
      {tracks.map(track => (
        <div key={track.id} className="w-full h-14 bg-white rounded-md relative flex items-center border border-slate-300">
          {track.clips.map(clip => (
             <TimelineClip 
                key={clip.id} 
                clip={clip}
                isSelected={clip.id === selectedClipId}
                onSelect={() => onSelectClip(clip.id)}
             />
          ))}
        </div>
      ))}
    </div>
  );
};
