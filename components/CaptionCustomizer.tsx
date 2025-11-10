import React from 'react';
import { AnimationStyle, TextAlign } from '../types';

interface ColorPickerProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, id, value, onChange, disabled }) => (
  <div className={`flex items-center justify-between transition-opacity ${disabled && 'opacity-50'}`}>
    <label htmlFor={id} className={`font-medium text-dark ${disabled && 'text-slate-400'}`}>{label}</label>
    <div className={`relative w-12 h-8 rounded-md overflow-hidden border-2 cursor-pointer ${!disabled ? 'border-secondary' : 'border-slate-300 bg-slate-200'}`}>
      <input
        id={id}
        type="color"
        value={value}
        disabled={disabled}
        onChange={onChange}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="w-full h-full" style={{ backgroundColor: value }}></div>
    </div>
  </div>
);

interface FontOption {
  name: string;
  cssName: string;
}

// FIX: Extracted CustomizerControls to a separate component to be reused in PropertiesPanel.
// This interface supports both use cases by making animation-specific props optional.
interface CustomizerControlsProps {
    color: string; onColorChange: (color: string) => void;
    scale: number; onScaleChange: (scale: number) => void;
    textAlign: TextAlign; onTextAlignChange: (align: TextAlign) => void;
    showBg: boolean; onShowBgChange: (show: boolean) => void;
    bgColor: string; onBgColorChange: (color: string) => void;
    bgOpacity: number; onBgOpacityChange: (opacity: number) => void;
    showOutline: boolean; onShowOutlineChange: (show: boolean) => void;
    outlineColor: string; onOutlineColorChange: (color: string) => void;
    outlineWidth: number; onOutlineWidthChange: (width: number) => void;
    fontFamily: string; onFontFamilyChange: (font: string) => void;
    fontOptions: FontOption[];
    isBold: boolean; onIsBoldChange: (bold: boolean) => void;
    isItalic: boolean; onIsItalicChange: (italic: boolean) => void;
    isUnderline: boolean; onIsUnderlineChange: (underline: boolean) => void;
    animationSpeed: number; onAnimationSpeedChange: (speed: number) => void;
    highlightColor?: string; onHighlightColorChange?: (color: string) => void;
    karaokeColor?: string; onKaraokeColorChange?: (color: string) => void;
    glowColor?: string; onGlowColorChange?: (color: string) => void;
    animationStyle?: AnimationStyle;
    isVideoLoaded: boolean;
}

export const CustomizerControls: React.FC<CustomizerControlsProps> = ({
    color, onColorChange, scale, onScaleChange, textAlign, onTextAlignChange,
    showBg, onShowBgChange, bgColor, onBgColorChange, bgOpacity, onBgOpacityChange,
    showOutline, onShowOutlineChange, outlineColor, onOutlineColorChange, outlineWidth, onOutlineWidthChange,
    fontFamily, onFontFamilyChange, fontOptions, isBold, onIsBoldChange, isItalic, onIsItalicChange, isUnderline, onIsUnderlineChange,
    animationSpeed, onAnimationSpeedChange,
    highlightColor, onHighlightColorChange, karaokeColor, onKaraokeColorChange, glowColor, onGlowColorChange, animationStyle,
    isVideoLoaded
}) => {
    const isHighlightAnimation = animationStyle === AnimationStyle.Highlight;
    const isKaraokeAnimation = animationStyle === AnimationStyle.Karaoke;
    const isGlowAnimation = animationStyle === AnimationStyle.Glow;

    return (
        <fieldset disabled={!isVideoLoaded} className="space-y-4 px-1 group">
            <div className={`flex items-center justify-between transition-opacity group-disabled:opacity-50`}>
                <label htmlFor="animation-speed" className="font-medium text-dark group-disabled:text-slate-400">Animation Speed</label>
                <input id="animation-speed" type="range" min="0.5" max="2" step="0.1" value={animationSpeed} onChange={(e) => onAnimationSpeedChange(parseFloat(e.target.value))}
                    className="w-32 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary disabled:cursor-not-allowed disabled:accent-slate-300" />
            </div>
             <hr className="border-secondary group-disabled:border-slate-300" />
            <div className="space-y-2">
                <label htmlFor="font-family" className="font-medium text-dark group-disabled:text-slate-400">Font Family</label>
                <select id="font-family" value={fontFamily} onChange={(e) => onFontFamilyChange(e.target.value)}
                    className="w-full p-2 bg-white rounded-md border border-secondary focus:ring-2 focus:ring-primary focus:border-transparent transition">
                    {fontOptions.map(font => (
                        <option key={font.name} value={font.cssName} style={{ fontFamily: font.cssName }}>{font.name}</option>
                    ))}
                </select>
            </div>
            <div className={`flex items-center justify-between transition-opacity group-disabled:opacity-50`}>
                <span className="font-medium text-dark group-disabled:text-slate-400">Style</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => onIsBoldChange(!isBold)} aria-label="Bold" className={`px-3 py-1 rounded-md transition-colors text-dark font-bold ${isBold ? 'bg-primary text-white' : 'bg-secondary'}`}>B</button>
                    <button onClick={() => onIsItalicChange(!isItalic)} aria-label="Italic" className={`px-3 py-1 rounded-md transition-colors text-dark italic ${isItalic ? 'bg-primary text-white' : 'bg-secondary'}`}>I</button>
                    <button onClick={() => onIsUnderlineChange(!isUnderline)} aria-label="Underline" className={`px-3 py-1 rounded-md transition-colors text-dark underline ${isUnderline ? 'bg-primary text-white' : 'bg-secondary'}`}>U</button>
                </div>
            </div>
            <hr className="border-secondary group-disabled:border-slate-300" />
            <ColorPicker label="Text Color" id="caption-color" value={color} onChange={(e) => onColorChange(e.target.value)} disabled={!isVideoLoaded} />
            {onHighlightColorChange && <ColorPicker label="Highlight Color" id="highlight-color" value={highlightColor || ''} onChange={(e) => onHighlightColorChange(e.target.value)} disabled={!isVideoLoaded || !isHighlightAnimation} />}
            {onKaraokeColorChange && <ColorPicker label="Karaoke Color" id="karaoke-color" value={karaokeColor || ''} onChange={(e) => onKaraokeColorChange(e.target.value)} disabled={!isVideoLoaded || !isKaraokeAnimation} />}
            {onGlowColorChange && <ColorPicker label="Glow Color" id="glow-color" value={glowColor || ''} onChange={(e) => onGlowColorChange(e.target.value)} disabled={!isVideoLoaded || !isGlowAnimation} />}
            <div className={`flex items-center justify-between transition-opacity group-disabled:opacity-50`}>
                <label htmlFor="caption-scale" className="font-medium text-dark group-disabled:text-slate-400">Text Size</label>
                <input id="caption-scale" type="range" min="0.1" max="2" step="0.05" value={scale} onChange={(e) => onScaleChange(parseFloat(e.target.value))}
                    className="w-32 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary disabled:cursor-not-allowed disabled:accent-slate-300" />
            </div>
            <div className={`flex items-center justify-between transition-opacity group-disabled:opacity-50`}>
                <span className="font-medium text-dark group-disabled:text-slate-400">Alignment</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => onTextAlignChange('left')} aria-label="Align left" className={`p-1.5 rounded-md ${textAlign === 'left' ? 'bg-primary text-white' : 'bg-secondary text-dark'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" /></svg>
                    </button>
                    <button onClick={() => onTextAlignChange('center')} aria-label="Align center" className={`p-1.5 rounded-md ${textAlign === 'center' ? 'bg-primary text-white' : 'bg-secondary text-dark'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    <button onClick={() => onTextAlignChange('right')} aria-label="Align right" className={`p-1.5 rounded-md ${textAlign === 'right' ? 'bg-primary text-white' : 'bg-secondary text-dark'}`}>
                        <svg xmlns="http://www.w.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M14 12h6M4 18h16" /></svg>
                    </button>
                </div>
            </div>
            <hr className="border-secondary group-disabled:border-slate-300" />
            <div className={`flex items-center justify-between transition-opacity group-disabled:opacity-50`}>
                <label htmlFor="show-outline" className="font-medium text-dark group-disabled:text-slate-400">Outline</label>
                <button id="show-outline" onClick={() => onShowOutlineChange(!showOutline)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors disabled:cursor-not-allowed ${showOutline ? 'bg-primary' : 'bg-secondary group-disabled:bg-slate-300'}`} aria-pressed={showOutline}>
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${showOutline ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
            <ColorPicker label="Outline Color" id="caption-outline-color" value={outlineColor} onChange={(e) => onOutlineColorChange(e.target.value)} disabled={!isVideoLoaded || !showOutline} />
            <div className={`flex items-center justify-between transition-opacity group-disabled:opacity-50 ${!showOutline && 'opacity-50'}`}>
                <label htmlFor="caption-outline-width" className={`font-medium text-dark ${!showOutline && 'text-slate-400'} group-disabled:text-slate-400`}>Outline Width</label>
                <input id="caption-outline-width" type="range" min="0" max="5" step="0.5" value={outlineWidth} disabled={!showOutline} onChange={(e) => onOutlineWidthChange(parseFloat(e.target.value))}
                    className="w-32 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary disabled:cursor-not-allowed disabled:accent-slate-300" />
            </div>
            <hr className="border-secondary group-disabled:border-slate-300" />
            <div className={`flex items-center justify-between transition-opacity group-disabled:opacity-50`}>
                <label htmlFor="show-bg" className="font-medium text-dark group-disabled:text-slate-400">Background</label>
                <button id="show-bg" onClick={() => onShowBgChange(!showBg)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors disabled:cursor-not-allowed ${showBg ? 'bg-primary' : 'bg-secondary group-disabled:bg-slate-300'}`} aria-pressed={showBg}>
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${showBg ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
            <ColorPicker label="BG Color" id="caption-bg-color" value={bgColor} onChange={(e) => onBgColorChange(e.target.value)} disabled={!isVideoLoaded || !showBg} />
            <div className={`flex items-center justify-between transition-opacity group-disabled:opacity-50 ${!showBg && 'opacity-50'}`}>
                <label htmlFor="caption-bg-opacity" className={`font-medium text-dark ${!showBg && 'text-slate-400'} group-disabled:text-slate-400`}>Opacity</label>
                <input id="caption-bg-opacity" type="range" min="0" max="1" step="0.05" value={bgOpacity} disabled={!showBg} onChange={(e) => onBgOpacityChange(parseFloat(e.target.value))}
                    className="w-32 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary disabled:cursor-not-allowed disabled:accent-slate-300" />
            </div>
        </fieldset>
    );
};


interface CaptionCustomizerProps {
    color: string; onColorChange: (color: string) => void;
    scale: number; onScaleChange: (scale: number) => void;
    textAlign: TextAlign; onTextAlignChange: (align: TextAlign) => void;
    showBg: boolean; onShowBgChange: (show: boolean) => void;
    bgColor: string; onBgColorChange: (color: string) => void;
    bgOpacity: number; onBgOpacityChange: (opacity: number) => void;
    showOutline: boolean; onShowOutlineChange: (show: boolean) => void;
    outlineColor: string; onOutlineColorChange: (color: string) => void;
    outlineWidth: number; onOutlineWidthChange: (width: number) => void;
    fontFamily: string; onFontFamilyChange: (font: string) => void;
    fontOptions: FontOption[];
    isBold: boolean; onIsBoldChange: (bold: boolean) => void;
    isItalic: boolean; onIsItalicChange: (italic: boolean) => void;
    isUnderline: boolean; onIsUnderlineChange: (underline: boolean) => void;
    animationSpeed: number; onAnimationSpeedChange: (speed: number) => void;
    highlightColor: string; onHighlightColorChange: (color: string) => void;
    karaokeColor: string; onKaraokeColorChange: (color: string) => void;
    glowColor: string; onGlowColorChange: (color: string) => void;
    animationStyle: AnimationStyle;
    isVideoLoaded: boolean;
}

export const CaptionCustomizer: React.FC<CaptionCustomizerProps> = (props) => {
    return (
        <div className="w-full flex flex-col gap-4 justify-center">
            <h3 className="text-lg font-semibold text-dark text-center">Customize Captions</h3>
            <CustomizerControls {...props} />
        </div>
    );
};