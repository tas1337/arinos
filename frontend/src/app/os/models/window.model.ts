export interface WindowState {
  id: string;
  type: 'help' | 'encode' | 'decode' | 'files' | 'settings' | 'browser' | 'note';
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  noteId?: string; // For note windows
}

