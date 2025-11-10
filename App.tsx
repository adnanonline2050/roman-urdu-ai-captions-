import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateCaptionsFromDescription } from './services/geminiService';
import { VideoPlayer } from './components/VideoPlayer';
import { AnimationSelector } from './components/AnimationSelector';
import { Loader } from './components/Loader';
import { CaptionCustomizer } from './components/CaptionCustomizer';
import type { Caption, AnimationTemplate, TextAlign } from './types';
import { AnimationStyle } from './types';
import { FONT_LIST } from './components/fontList';

const ANIMATION_TEMPLATES: AnimationTemplate[] = [
  { id: AnimationStyle.Fade, name: 'Fade Up', className: 'animate-fade-in-up' },
  { id: AnimationStyle.Pop, name: 'Pop In', className: 'animate-pop-in' },
  { id: AnimationStyle.Slide, name: 'Slide In', className: 'animate-slide-from-bottom' },
  { id: AnimationStyle.Glow, name: 'Glow', className: '' },
  { id: AnimationStyle.Typewriter, name: 'Typewriter', className: '' },
  { id: AnimationStyle.Zoom, name: 'Zoom', className: 'animate-zoom-in-out' },
  { id: AnimationStyle.Blur, name: 'Blur In', className: 'animate-blur-in' },
  { id: AnimationStyle.Karaoke, name: 'Karaoke', className: '' },
  { id: AnimationStyle.BubblePop, name: 'Bubble Pop', className: '' },
  { id: AnimationStyle.Highlight, name: 'Highlight', className: '' },
  { id: AnimationStyle.WordPulse, name: 'Word Pulse', className: '' },
  { id: AnimationStyle.Bounce, name: 'Bounce', className: '' },
  { id: AnimationStyle.Blink, name: 'Blink', className: '' },
];


const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>(AnimationStyle.Fade);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1);
  const [captionColor, setCaptionColor] = useState<string>('#FFFFFF');
  const [captionScale, setCaptionScale] = useState<number>(1);
  const [textAlign, setTextAlign] = useState<TextAlign>('center');
  const [showCaptionBg, setShowCaptionBg] = useState<boolean>(true);
  const [captionBgColor, setCaptionBgColor] = useState<string>('#000000');
  const [captionBgOpacity, setCaptionBgOpacity] = useState<number>(0.6);
  const [highlightColor, setHighlightColor] = useState<string>('#8A2BE2');
  const [karaokeColor, setKaraokeColor] = useState<string>('#E95420');
  const [glowColor, setGlowColor] = useState<string>('#F97316');
  const [showCaptionOutline, setShowCaptionOutline] = useState<boolean>(true);
  const [captionOutlineColor, setCaptionOutlineColor] = useState<string>('#000000');
  const [captionOutlineWidth, setCaptionOutlineWidth] = useState<number>(1);
  const [fontFamily, setFontFamily] = useState<string>(FONT_LIST[0].cssName);
  const [isBold, setIsBold] = useState<boolean>(true);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!videoFile) {
      setVideoSrc(null);
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setVideoSrc(url);

    descriptionTextareaRef.current?.focus();

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [videoFile]);

  useEffect(() => {
    if (!fontFamily) return;
    const fontName = fontFamily.split(',')[0].replace(/'/g, '').trim();
    if (!fontName) return;
    const fontId = `font-link-${fontName.replace(/\s+/g, '-')}`;
    if (document.getElementById(fontId)) return;
    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:ital,wght@0,400;0,700;1,400;1,700&display=swap`;
    document.head.appendChild(link);
  }, [fontFamily]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setCaptions(null);
      setError(null);
    }
  };

  const handleGenerateClick = useCallback(async () => {
    if (!videoDescription.trim()) {
      setError('Please describe the video content first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setCaptions(null);
    try {
      const generatedCaptions = await generateCaptionsFromDescription(videoDescription);
      setCaptions(generatedCaptions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [videoDescription]);

  const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  );
  
  const Panel = ({ children, className }: { children?: React.ReactNode, className?: string }) => (
    <div className={`bg-panel p-6 rounded-2xl shadow-lg border border-secondary ${className}`}>
      {children}
    </div>
  );

  const CaptionsWorkspace = () => (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Panel>
          <AnimationSelector
            templates={ANIMATION_TEMPLATES}
            selectedStyle={animationStyle}
            onSelectStyle={setAnimationStyle}
            isVideoLoaded={!!videoSrc}
          />
        </Panel>
        <Panel>
          <CaptionCustomizer
            color={captionColor} onColorChange={setCaptionColor}
            scale={captionScale} onScaleChange={setCaptionScale}
            textAlign={textAlign} onTextAlignChange={setTextAlign}
            showBg={showCaptionBg} onShowBgChange={setShowCaptionBg}
            bgColor={captionBgColor} onBgColorChange={setCaptionBgColor}
            bgOpacity={captionBgOpacity} onBgOpacityChange={setCaptionBgOpacity}
            highlightColor={highlightColor} onHighlightColorChange={setHighlightColor}
            karaokeColor={karaokeColor} onKaraokeColorChange={setKaraokeColor}
            glowColor={glowColor} onGlowColorChange={setGlowColor}
            animationStyle={animationStyle} isVideoLoaded={!!videoSrc}
            showOutline={showCaptionOutline} onShowOutlineChange={setShowCaptionOutline}
            outlineColor={captionOutlineColor} onOutlineColorChange={setCaptionOutlineColor}
            outlineWidth={captionOutlineWidth} onOutlineWidthChange={setCaptionOutlineWidth}
            fontFamily={fontFamily} onFontFamilyChange={setFontFamily}
            fontOptions={FONT_LIST}
            isBold={isBold} onIsBoldChange={setIsBold}
            isItalic={isItalic} onIsItalicChange={setIsItalic}
            isUnderline={isUnderline} onIsUnderlineChange={setIsUnderline}
            animationSpeed={animationSpeed} onAnimationSpeedChange={setAnimationSpeed}
          />
        </Panel>
      </div>
  );


  return (
    <div className="min-h-screen text-dark font-sans">
      <header className="py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-dark tracking-tight">Roman Urdu Ai Captions</h1>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          <div className="lg:col-span-3 flex flex-col gap-6">
            {videoSrc ? (
              <VideoPlayer 
                videoSrc={videoSrc} captions={captions} 
                animationStyle={animationStyle} animationTemplates={ANIMATION_TEMPLATES}
                captionColor={captionColor} captionScale={captionScale}
                showCaptionBg={showCaptionBg} captionBgColor={captionBgColor} captionBgOpacity={captionBgOpacity}
                highlightColor={highlightColor} karaokeColor={karaokeColor} glowColor={glowColor}
                textAlign={textAlign}
                showCaptionOutline={showCaptionOutline} captionOutlineColor={captionOutlineColor} captionOutlineWidth={captionOutlineWidth}
                fontFamily={fontFamily} isBold={isBold} isItalic={isItalic} isUnderline={isUnderline}
                animationSpeed={animationSpeed}
              />
            ) : (
              <div className="aspect-video w-full bg-secondary rounded-xl flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55a2 2 0 01.45 2.122l-2 6A2 2 0 0116 19H8a2 2 0 01-2-2V7a2 2 0 012-2h4l3 3z" />
                </svg>
                <h2 className="text-2xl font-semibold text-slate-600">Your Video Will Appear Here</h2>
                <p className="text-slate-500 mt-2">Upload a video file to get started.</p>
              </div>
            )}
            
            <CaptionsWorkspace />
            
          </div>

          <Panel className="lg:col-span-2 flex flex-col gap-6 h-fit">
            <div>
              <label htmlFor="video-upload" className="text-xl font-semibold text-dark mb-3 block">1. Upload Video</label>
              <input
                id="video-upload" type="file" accept="video/*" onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-accent cursor-pointer"
              />
            </div>

            <div>
              <label htmlFor="video-description" className="text-xl font-semibold text-dark mb-3 block">2. Describe Video</label>
              <div className="text-sm bg-orange-100 p-3 rounded-lg text-orange-900 mb-3 flex items-start border border-orange-200">
                <InfoIcon className="text-orange-500" />
                <span>AI will <strong>create a new script</strong> based on your description. This is not for transcribing audio. Provide a clear summary for the best results.</span>
              </div>
              <textarea
                ref={descriptionTextareaRef} id="video-description" rows={5} value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="e.g., 'A chef explaining how to make biryani', 'Karachi street food tour', etc."
                className="w-full p-3 bg-white rounded-lg border border-secondary focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder:text-slate-400"
                disabled={!videoFile}
              />
            </div>
            <button
              onClick={handleGenerateClick} disabled={!videoFile || !videoDescription.trim() || isLoading}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-accent transition-all duration-300 ease-in-out disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isLoading ? 'Generating...' : 'Generate Captions'}
            </button>
            {isLoading && <Loader message="AI is crafting your captions..." />}
            {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg border border-red-200">{error}</p>}
            {captions && (
              <div className="mt-4">
                  <h3 className="text-xl font-semibold text-dark mb-2">Generated Captions</h3>
                  <div className="max-h-60 overflow-y-auto bg-white/50 p-3 rounded-lg border border-secondary">
                    {captions.map((cap, index) => (
                      <div key={index} className="mb-2 p-2 rounded bg-slate-200">
                        <p className="text-xs text-primary font-mono">{cap.start.toFixed(2)}s - {cap.end.toFixed(2)}s</p>
                        <p className="text-dark">{cap.words.map(w => w.text).join(' ')}</p>
                      </div>
                    ))}
                  </div>
              </div>
            )}
          </Panel>
        </div>
      </main>
    </div>
  );
};

export default App;