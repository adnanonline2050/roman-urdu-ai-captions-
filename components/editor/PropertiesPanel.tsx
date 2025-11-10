import React from 'react';
import type { EditorClip, TextClip } from '../../types';
import { ClipType } from '../../types';
import { CustomizerControls } from '../CaptionCustomizer';
import { FONT_LIST } from '../fontList';

interface PropertiesPanelProps {
  clip: EditorClip;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ clip }) => {
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // In a real app, this would update the state in the parent VideoEditor component
    console.log("Text changed:", e.target.value);
  };
  
  if (clip.type === ClipType.Text) {
    const textClip = clip as TextClip;
    return (
      <div>
        <h3 className="text-lg font-semibold text-dark mb-4">Text Properties</h3>
        <textarea
            value={textClip.content}
            onChange={handleTextChange}
            className="w-full p-2 bg-white rounded-md border border-secondary focus:ring-2 focus:ring-primary focus:border-transparent transition"
            rows={3}
        />
        <div className="mt-4">
             <CustomizerControls
                // Dummy props - in a real app these would be connected to state
                color={textClip.color} onColorChange={() => {}}
                scale={textClip.scale} onScaleChange={() => {}}
                textAlign={textClip.textAlign} onTextAlignChange={() => {}}
                showBg={textClip.showBg} onShowBgChange={() => {}}
                bgColor={textClip.bgColor} onBgColorChange={() => {}}
                bgOpacity={textClip.bgOpacity} onBgOpacityChange={() => {}}
                showOutline={textClip.showOutline} onShowOutlineChange={() => {}}
                outlineColor={textClip.outlineColor} onOutlineColorChange={() => {}}
                outlineWidth={textClip.outlineWidth} onOutlineWidthChange={() => {}}
                fontFamily={textClip.fontFamily} onFontFamilyChange={() => {}}
                fontOptions={FONT_LIST}
                isBold={textClip.isBold} onIsBoldChange={() => {}}
                isItalic={textClip.isItalic} onIsItalicChange={() => {}}
                isUnderline={textClip.isUnderline} onIsUnderlineChange={() => {}}
                isVideoLoaded={true}
            />
        </div>
      </div>
    );
  }

  if (clip.type === ClipType.Video) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-dark">Video Properties</h3>
        <p className="text-slate-600">Video settings will appear here.</p>
      </div>
    );
  }

  return null;
};
