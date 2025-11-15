import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WindowState } from '../models/window.model';

@Injectable({
  providedIn: 'root'
})
export class WindowManagerService {
  private windows$ = new BehaviorSubject<WindowState[]>([]);
  private zIndexCounter = 1000;

  getWindows(): Observable<WindowState[]> {
    return this.windows$.asObservable();
  }

  getWindowsValue(): WindowState[] {
    return this.windows$.value;
  }

  openWindow(type: 'help' | 'encode' | 'decode' | 'files' | 'settings' | 'browser' | 'note' | 'pdf', noteId?: string, pdfPath?: string): void {
    const windows = this.windows$.value;
    
    // For note windows, check if this specific note is already open
    if (type === 'note' && noteId) {
      const existingWindow = windows.find(w => w.type === 'note' && w.noteId === noteId && !w.minimized);
      if (existingWindow) {
        existingWindow.minimized = false;
        existingWindow.maximized = false;
        this.bringToFront(existingWindow.id);
        return;
      }
    } else if (type === 'pdf' && pdfPath) {
      // For PDF windows, check if this specific PDF is already open
      const existingWindow = windows.find(w => w.type === 'pdf' && w.pdfPath === pdfPath && !w.minimized);
      if (existingWindow) {
        existingWindow.minimized = false;
        existingWindow.maximized = false;
        this.bringToFront(existingWindow.id);
        return;
      }
    } else {
      // Check if window already exists (for non-note, non-pdf windows)
      const existingWindow = windows.find(w => w.type === type && !w.minimized);
      if (existingWindow) {
        existingWindow.minimized = false;
        existingWindow.maximized = false;
        this.bringToFront(existingWindow.id);
        return;
      }
    }

    const windowId = `${type}-${Date.now()}`;
    
    // Center windows on screen
    const windowWidth = type === 'note' ? 600 : type === 'pdf' ? 900 : 700;
    const windowHeight = type === 'note' ? 500 : type === 'pdf' ? 700 : 600;
    const screenWidth = window.innerWidth || 1920;
    const screenHeight = window.innerHeight || 1080;
    
    // Center position, with slight offset for multiple windows
    const offsetX = (windows.length % 3) * 30;
    const offsetY = (windows.length % 3) * 30;
    const centerX = (screenWidth - windowWidth) / 2 + offsetX;
    const centerY = (screenHeight - windowHeight) / 2 + offsetY;

    const newWindow: WindowState = {
      id: windowId,
      type,
      x: Math.max(0, centerX),
      y: Math.max(0, centerY),
      width: windowWidth,
      height: windowHeight,
      minimized: false,
      maximized: false,
      noteId: type === 'note' ? noteId : undefined,
      pdfPath: type === 'pdf' ? pdfPath : undefined
    };

    this.windows$.next([...windows, newWindow]);
    this.bringToFront(windowId);
  }

  closeWindow(windowId: string): void {
    const windows = this.windows$.value.filter(w => w.id !== windowId);
    this.windows$.next(windows);
  }

  minimizeWindow(windowId: string): void {
    const windows = this.windows$.value;
    const window = windows.find(w => w.id === windowId);
    if (window) {
      window.minimized = true;
      this.windows$.next([...windows]);
    }
  }

  maximizeWindow(windowId: string): void {
    const windows = this.windows$.value;
    const window = windows.find(w => w.id === windowId);
    if (window) {
      window.maximized = !window.maximized;
      this.windows$.next([...windows]);
    }
  }

  updateWindowPosition(windowId: string, x: number, y: number): void {
    const windows = this.windows$.value;
    const window = windows.find(w => w.id === windowId);
    if (window) {
      window.x = x;
      window.y = y;
      this.windows$.next([...windows]);
    }
  }

  updateWindowSize(windowId: string, width: number, height: number): void {
    const windows = this.windows$.value;
    const window = windows.find(w => w.id === windowId);
    if (window) {
      window.width = width;
      window.height = height;
      this.windows$.next([...windows]);
    }
  }

  bringToFront(windowId: string): void {
    const windows = this.windows$.value;
    const window = windows.find(w => w.id === windowId);
    if (window) {
      // Reorder windows array to put this one last (highest z-index)
      const reordered = windows.filter(w => w.id !== windowId).concat([window]);
      this.windows$.next(reordered);
    }
  }

  getZIndex(windowId: string): number {
    const windows = this.windows$.value;
    const index = windows.findIndex(w => w.id === windowId);
    return this.zIndexCounter + (index >= 0 ? index : 0);
  }

  getWindowTitle(type: string, noteName?: string, pdfName?: string): string {
    switch(type) {
      case 'help': return 'How It Works';
      case 'encode': return 'Encode Message';
      case 'decode': return 'Decode Message';
      case 'files': return 'Files';
      case 'settings': return 'Settings';
      case 'browser': return 'Browser';
      case 'note': return noteName || 'Note';
      case 'pdf': return pdfName || 'PDF Viewer';
      default: return 'Window';
    }
  }
}

