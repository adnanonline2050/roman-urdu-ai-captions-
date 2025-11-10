import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimationStyle } from '../types';
import type { Caption, AnimationTemplate, TextAlign } from '../types';

interface VideoPlayerProps {
  videoSrc: string;
  captions: Caption[] | null;
  animationStyle: AnimationStyle;
  animationTemplates: AnimationTemplate[];
  captionColor: string;
  captionScale: number;
  showCaptionBg: boolean;
  captionBgColor: string;
  captionBgOpacity: number;
  highlightColor: string;
  karaokeColor: string;
  glowColor: string;
  textAlign: TextAlign;
  showCaptionOutline: boolean;
  captionOutlineColor: string;
  captionOutlineWidth: number;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  animationSpeed: number;
}

const isWordByWordAnimation = (style: AnimationStyle) => {
  return style === AnimationStyle.Karaoke || 
         style === AnimationStyle.BubblePop || 
         style === AnimationStyle.Highlight || 
         style === AnimationStyle.WordPulse ||
         style === AnimationStyle.Glow ||
         style === AnimationStyle.Typewriter ||
         style === AnimationStyle.Bounce ||
         style === AnimationStyle.Blink;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoSrc, captions, animationStyle, 
  animationTemplates, captionColor, captionScale,
  showCaptionBg, captionBgColor, captionBgOpacity,
  highlightColor, karaokeColor, glowColor,
  textAlign, showCaptionOutline, captionOutlineColor, captionOutlineWidth,
  fontFamily, isBold, isItalic, isUnderline, animationSpeed
 }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const [currentCaption, setCurrentCaption] = useState<Caption | null>(null);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const [typewriterText, setTypewriterText] = useState('');
  const [captionWidth, setCaptionWidth] = useState<number>(0);
  const [captionPosition, setCaptionPosition] = useState<React.CSSProperties>({});
  const animationFrameId = useRef<number | null>(null);
  
  const dragInfo = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialLeft: 0,
    initialTop: 0,
  });

  const resizeInfo = useRef({
    isResizing: false,
    direction: null as 'left' | 'right' | null,
    startX: 0,
    initialWidth: 0,
    initialLeft: 0,
  });


  useEffect(() => {
    const videoElement = videoRef.current;
    const containerElement = containerRef.current;
    if (!videoElement || !containerElement) return;

    const calculateStyles = () => {
      const { videoWidth, videoHeight } = videoElement;
      const { clientWidth: containerWidth, clientHeight: containerHeight } = containerElement;

      if (!videoWidth || !videoHeight || !containerWidth || !containerHeight) return;

      const videoAR = videoWidth / videoHeight;
      const containerAR = containerWidth / containerHeight;
      
      let renderedWidth = containerWidth;
      let initialTop = '92%'; // Default for landscape

      // Video is taller than container aspect ratio (e.g., portrait video in 16:9 frame), so it's letterboxed
      if (videoAR < containerAR) { 
        renderedWidth = containerHeight * videoAR;
      }
      
      if (videoAR < 1) { // Portrait
        initialTop = '80%';
      } else if (videoAR === 1) { // Square
        initialTop = '90%';
      }

      const initialCaptionWidth = renderedWidth * 0.9;
      setCaptionWidth(initialCaptionWidth);

      // Set initial position
      setCaptionPosition({
        top: initialTop,
        left: '50%',
        transform: 'translate(-50%, -50%)'
      });
    };
    
    videoElement.addEventListener('loadedmetadata', calculateStyles);
    const resizeObserver = new ResizeObserver(calculateStyles);
    resizeObserver.observe(containerElement);

    if (videoElement.videoWidth) {
        calculateStyles();
    }

    return () => {
      videoElement.removeEventListener('loadedmetadata', calculateStyles);
      resizeObserver.unobserve(containerElement);
    };
  }, [videoSrc]);

  const animationLoop = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !captions) {
        animationFrameId.current = requestAnimationFrame(animationLoop);
        return;
    };

    const currentTime = videoElement.currentTime;
    const activeCaption = captions.find(caption => currentTime >= caption.start && currentTime <= caption.end);

    if (activeCaption) {
      if (currentCaption?.start !== activeCaption.start) {
        setCurrentCaption(activeCaption);
      }

      if (isWordByWordAnimation(animationStyle)) {
        if (animationStyle === AnimationStyle.Typewriter) {
            let visibleText = '';
            for (const word of activeCaption.words) {
              if (currentTime >= word.end) {
                visibleText += word.text + ' ';
              } else if (currentTime >= word.start && currentTime < word.end) {
                const wordDuration = word.end - word.start;
                // Handle zero duration to prevent division by zero
                const progressInWord = wordDuration > 0 ? (currentTime - word.start) / wordDuration : 1;
                const charsToShow = Math.ceil(progressInWord * word.text.length);
                visibleText += word.text.substring(0, charsToShow);
                break; // Stop after the current word
              } else {
                break; // Don't show future words
              }
            }
            setTypewriterText(visibleText);
        } else {
            const currentWordIndex = activeCaption.words.findIndex(word => currentTime >= word.start && currentTime < word.end);
            if(activeWordIndex !== currentWordIndex) {
                setActiveWordIndex(currentWordIndex);
            }
        }
      } else {
        if (activeWordIndex !== -1) {
            setActiveWordIndex(-1);
        }
      }
    } else {
      if (currentCaption !== null) {
        setCurrentCaption(null);
        setActiveWordIndex(-1);
        setTypewriterText('');
      }
    }

    animationFrameId.current = requestAnimationFrame(animationLoop);
  }, [captions, animationStyle, currentCaption, activeWordIndex]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const startLoop = () => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = requestAnimationFrame(animationLoop);
    };

    const stopLoop = () => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }
    };

    videoElement.addEventListener('play', startLoop);
    videoElement.addEventListener('playing', startLoop);
    videoElement.addEventListener('pause', stopLoop);
    videoElement.addEventListener('ended', stopLoop);
    videoElement.addEventListener('seeked', startLoop);

    // Initial start if video is already playing
    if (!videoElement.paused) {
        startLoop();
    }

    return () => {
        stopLoop();
        if (videoElement) {
          videoElement.removeEventListener('play', startLoop);
          videoElement.removeEventListener('playing', startLoop);
          videoElement.removeEventListener('pause', stopLoop);
          videoElement.removeEventListener('ended', stopLoop);
          videoElement.removeEventListener('seeked', startLoop);
        }
    };
  }, [animationLoop]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (resizeInfo.current.isResizing) return;
    const captionElement = captionRef.current;
    if (!captionElement) return;

    e.preventDefault();
    dragInfo.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialLeft: captionElement.offsetLeft,
      initialTop: captionElement.offsetTop,
    };
    
    document.body.style.cursor = 'grabbing';
    
    const handlePointerMove = (ev: PointerEvent) => {
        if (!dragInfo.current.isDragging || !containerRef.current || !captionRef.current) return;
        
        const dx = ev.clientX - dragInfo.current.startX;
        const dy = ev.clientY - dragInfo.current.startY;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        const captionRect = captionRef.current.getBoundingClientRect();
    
        let newLeft = dragInfo.current.initialLeft + dx;
        let newTop = dragInfo.current.initialTop + dy;
    
        // Boundary checks
        newLeft = Math.max(0, Math.min(newLeft, containerRect.width - captionRect.width));
        newTop = Math.max(0, Math.min(newTop, containerRect.height - captionRect.height));
        
        setCaptionPosition({
          left: `${newLeft}px`,
          top: `${newTop}px`,
          transform: 'none', // Override initial transform after dragging
          bottom: 'auto',
        });
    };

    const handlePointerUp = () => {
        dragInfo.current.isDragging = false;
        document.body.style.cursor = 'default';
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
    };
    
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, []);

  const handleResizePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>, direction: 'left' | 'right') => {
    const captionElement = captionRef.current;
    if (!captionElement || !containerRef.current) return;
  
    e.stopPropagation();
    e.preventDefault();
  
    resizeInfo.current = {
      isResizing: true,
      direction: direction,
      startX: e.clientX,
      initialWidth: captionElement.offsetWidth,
      initialLeft: captionElement.offsetLeft,
    };
  
    document.body.style.cursor = 'ew-resize';
  
    const handlePointerMove = (ev: PointerEvent) => {
      if (!resizeInfo.current.isResizing || !captionRef.current || !containerRef.current) return;
  
      const dx = ev.clientX - resizeInfo.current.startX;
      const containerRect = containerRef.current.getBoundingClientRect();
      let newWidth = resizeInfo.current.initialWidth;
      let newLeft = resizeInfo.current.initialLeft;
  
      if (resizeInfo.current.direction === 'right') {
        newWidth = resizeInfo.current.initialWidth + dx;
        // Boundary check for right edge
        if (newLeft + newWidth > containerRect.width) {
          newWidth = containerRect.width - newLeft;
        }
      } else { // 'left'
        newWidth = resizeInfo.current.initialWidth - dx;
        newLeft = resizeInfo.current.initialLeft + dx;
        // Boundary check for left edge
        if (newLeft < 0) {
          newWidth += newLeft; // reduce width by the amount it went negative
          newLeft = 0;
        }
      }
  
      // Minimum width
      const minWidth = 100;
      if (newWidth < minWidth) {
        if (resizeInfo.current.direction === 'left') {
          newLeft += newWidth - minWidth;
        }
        newWidth = minWidth;
      }
  
      setCaptionWidth(newWidth);
      setCaptionPosition(prev => ({ ...prev, left: `${newLeft}px`, transform: 'none' }));
    };
  
    const handlePointerUp = () => {
      resizeInfo.current.isResizing = false;
      document.body.style.cursor = 'default';
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, []);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }; // Default to black if invalid
  };

  const getBackgroundColor = () => {
    if (!showCaptionBg) return 'transparent';
    const { r, g, b } = hexToRgb(captionBgColor);
    return `rgba(${r}, ${g}, ${b}, ${captionBgOpacity})`;
  };

  const getTextShadowStyle = () => {
    const shadows = ['2px 2px 4px rgba(0,0,0,0.5)']; // Base drop shadow
    if (showCaptionOutline && captionOutlineWidth > 0) {
      const width = Math.round(captionOutlineWidth);
      const color = captionOutlineColor;
      // Generate a simple 4-corner stroke for performance
      shadows.unshift(
        `-${width}px -${width}px 0 ${color}`,
        ` ${width}px -${width}px 0 ${color}`,
        `-${width}px  ${width}px 0 ${color}`,
        ` ${width}px  ${width}px 0 ${color}`
      );
    }
    return shadows.join(', ');
  };

  const selectedAnimation = animationTemplates.find(t => t.id === animationStyle);
  
  const renderWordByWordCaption = () => {
    if (!currentCaption) return null;

    if (animationStyle === AnimationStyle.Typewriter) {
        return (
            <>
                {typewriterText}
                <span className="animate-blink-caret inline-block w-1 bg-current" style={{ animationDuration: '1s' }}></span>
            </>
        );
    }

    return currentCaption.words.map((word, index) => {
      const isCurrentWord = index === activeWordIndex;
      const isVisible = videoRef.current && videoRef.current.currentTime >= word.start;
      
      let wordClassName = 'transition-all duration-200 px-1';
      let style: React.CSSProperties = {};
      const wordAnimSpeed = (base: number) => ({ animationDuration: `${base / animationSpeed}s`});

      if (!isVisible) {
        style.visibility = 'hidden';
      } else {
         if (animationStyle === AnimationStyle.Karaoke) {
            if (isCurrentWord) {
                style.color = karaokeColor;
                wordClassName += ' scale-110';
            }
        } else if (animationStyle === AnimationStyle.BubblePop) {
             if (isCurrentWord) {
                wordClassName += ' animate-bubble-pop-in';
                style = {...style, ...wordAnimSpeed(0.5)};
            }
        } else if (animationStyle === AnimationStyle.Highlight) {
            if (isCurrentWord) {
                style.backgroundColor = highlightColor;
                style.borderRadius = '5px';
            }
        } else if (animationStyle === AnimationStyle.WordPulse) {
            if (isCurrentWord) {
                wordClassName += ' animate-word-pulse';
                style = {...style, ...wordAnimSpeed(0.4)};
            }
        } else if (animationStyle === AnimationStyle.Glow) {
          if (isCurrentWord) {
            wordClassName += ' animate-glow';
            style['--glow-color' as any] = glowColor;
            style = {...style, ...wordAnimSpeed(1.5)};
          }
        } else if (animationStyle === AnimationStyle.Bounce) {
            // Animate only once when the word first becomes visible
            if (isCurrentWord) {
                wordClassName += ' animate-word-bounce-in';
                style = {...style, ...wordAnimSpeed(0.6)};
            }
        } else if (animationStyle === AnimationStyle.Blink) {
            if (isCurrentWord) {
                wordClassName += ' animate-blink';
                style = {...style, ...wordAnimSpeed(2)};
            }
        }
      }

      return (
        <span key={index} className={`inline-block ${wordClassName}`} style={style}>
          {word.text}&nbsp;
        </span>
      );
    });
  };

  const getTextAlignClass = () => {
    switch(textAlign) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      case 'center':
      default:
        return 'text-center';
    }
  }

  const phraseAnimationSpeed = 0.5 / animationSpeed;

  return (
    <div ref={containerRef} className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-secondary">
      <video ref={videoRef} src={videoSrc} controls className="w-full h-full object-contain" />
      {currentCaption && (
        <div 
          ref={captionRef}
          onPointerDown={handlePointerDown}
          key={`${currentCaption.start}-${animationStyle}`} 
          className={`absolute pointer-events-auto cursor-move flex justify-center items-center group`}
          style={{ width: `${captionWidth}px`, ...captionPosition}}
        >
          <div 
            onPointerDown={(e) => handleResizePointerDown(e, 'left')}
            className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-10 bg-primary rounded-full cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Resize left"
          />
          <p 
            className={`font-bold p-2 md:p-4 rounded-lg w-full whitespace-normal break-words ${getTextAlignClass()} ${!isWordByWordAnimation(animationStyle) ? selectedAnimation?.className : ''}`}
            style={{ 
              color: captionColor,
              backgroundColor: getBackgroundColor(),
              textShadow: getTextShadowStyle(),
              fontSize: `calc((0.4rem + 1vw) * ${captionScale})`,
              fontFamily: fontFamily,
              fontWeight: isBold ? 'bold' : 'normal',
              fontStyle: isItalic ? 'italic' : 'normal',
              textDecoration: isUnderline ? 'underline' : 'none',
              animationDuration: !isWordByWordAnimation(animationStyle) ? `${phraseAnimationSpeed}s` : undefined,
            }}
          >
            {isWordByWordAnimation(animationStyle) ? renderWordByWordCaption() : currentCaption.words.map(w => w.text).join(' ')}
          </p>
          <div 
            onPointerDown={(e) => handleResizePointerDown(e, 'right')}
            className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-10 bg-primary rounded-full cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Resize right"
          />
        </div>
      )}
    </div>
  );
};