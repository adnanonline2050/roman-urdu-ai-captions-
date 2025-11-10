export interface Word {
  text: string;
  start: number;
  end: number;
}

export interface Caption {
  start: number;
  end: number;
  words: Word[];
}

export type TextAlign = 'left' | 'center' | 'right';

export enum AnimationStyle {
  Fade = 'fade',
  Pop = 'pop',
  Slide = 'slide',
  Glow = 'glow',
  Typewriter = 'typewriter',
  Zoom = 'zoom',
  Blur = 'blur',
  Karaoke = 'karaoke',
  BubblePop = 'bubble-pop',
  Highlight = 'highlight',
  WordPulse = 'word-pulse',
  Bounce = 'bounce',
  Blink = 'blink',
}

export interface AnimationTemplate {
  id: AnimationStyle;
  name: string;
  className: string;
}

// FIX: Added missing editor types to resolve import errors.
export enum ClipType {
  Video = 'video',
  Text = 'text',
}

interface BaseClip {
  id: string;
  type: ClipType;
  start: number;
  duration: number;
}

export interface VideoClip extends BaseClip {
  type: ClipType.Video;
  file: File;
  src: string;
  trimStart: number;
}

export interface TextClip extends BaseClip {
  type: ClipType.Text;
  content: string;
  color: string;
  scale: number;
  textAlign: TextAlign;
  showBg: boolean;
  bgColor: string;
  bgOpacity: number;
  showOutline: boolean;
  outlineColor: string;
  outlineWidth: number;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
}

export type EditorClip = VideoClip | TextClip;

export interface EditorTrack {
  id: string;
  clips: EditorClip[];
}
