export interface WindowState {
  id: string;
  type: 'help' | 'encode' | 'decode' | 'files' | 'settings' | 'browser';
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
}

