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

  openWindow(type: 'help' | 'encode' | 'decode' | 'files' | 'settings' | 'browser'): void {
    const windows = this.windows$.value;
    
    // Check if window already exists
    const existingWindow = windows.find(w => w.type === type && !w.minimized);
    if (existingWindow) {
      existingWindow.minimized = false;
      existingWindow.maximized = false;
      this.bringToFront(existingWindow.id);
      return;
    }

    const windowId = `${type}-${Date.now()}`;
    
    // Center windows on screen
    const windowWidth = 700;
    const windowHeight = 600;
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
      maximized: false
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

  getWindowTitle(type: string): string {
    switch(type) {
      case 'help': return 'How It Works';
      case 'encode': return 'Encode Message';
      case 'decode': return 'Decode Message';
      case 'files': return 'Files';
      case 'settings': return 'Settings';
      case 'browser': return 'Browser';
      default: return 'Window';
    }
  }
}

