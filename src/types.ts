export interface CineTrackFile {
  path: string;
  content: string;
  type: 'html' | 'js' | 'css' | 'json';
}

export type ActivePage = 'main' | 'reset-password' | 'updates' | 'config' | 'worker';
