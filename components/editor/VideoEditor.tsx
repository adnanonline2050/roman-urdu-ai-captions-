import React, { useState } from 'react';
import type { EditorClip, EditorTrack } from '../../types';
import { ClipType } from '../../types';
import { Timeline } from './Timeline';
import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { FONT_LIST } from '../fontList';

interface VideoEditorProps {
  videoFile: File;
  videoSrc: string;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({ videoFile, videoSrc }) => {
  const [tracks, setTracks] = useState<EditorTrack[]>([
    { 
      id: 'track-1',
      clips: [{
        id: `video-${Date.now()}`,
        type: ClipType.Video,
        start: 0,
        duration: 10, // Placeholder duration
        file: videoFile,
        src: videoSrc,
        trimStart: 0,
      }],
    },
    { id: 'track-2', clips: [] },
  ]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(tracks[0].clips[0].id);

  const handleAddText = () => {
    const newTextClip = {
      id: `text-${Date.now()}`,
      type: ClipType.Text,
      start: 0,
      duration: 5,
      content: 'New Text',
      color: '#000000',
      scale: 1,
      textAlign: 'center' as const,
      showBg: false,
      bgColor: '#FFFFFF',
      bgOpacity: 0.7,
      showOutline: false,
      outlineColor: '#000000',
      outlineWidth: 1,
      fontFamily: FONT_LIST[0].cssName,
      isBold: false,
      isItalic: false,
      isUnderline: false,
    };
    
    setTracks(prevTracks => {
      const newTracks = [...prevTracks];
      const textTrack = newTracks.find(t => t.id === 'track-2');
      if(textTrack) {
        textTrack.clips.push(newTextClip);
      }
      return newTracks;
    });
  };

  const selectedClip = tracks.flatMap(t => t.clips).find(c => c.id === selectedClipId) || null;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="bg-panel p-4 rounded-2xl shadow-lg border border-secondary">
        <Toolbar onAddText={handleAddText} />
      </div>
      <div className="bg-panel p-4 rounded-2xl shadow-lg border border-secondary">
        <Timeline tracks={tracks} onSelectClip={setSelectedClipId} selectedClipId={selectedClipId} />
      </div>
      {selectedClip && (
        <div className="bg-panel p-4 rounded-2xl shadow-lg border border-secondary">
           <PropertiesPanel clip={selectedClip} />
        </div>
      )}
    </div>
  );
};
