import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { WindowManagerService } from '../services/window-manager.service';
import { WindowState } from '../models/window.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.css']
})
export class TaskbarComponent implements OnInit, OnDestroy {
  @Output() openWindow = new EventEmitter<string>();
  
  windows: WindowState[] = [];
  private windowsSubscription?: Subscription;
  currentTime: string = '';
  private timeInterval?: any;

  constructor(private windowManager: WindowManagerService) {}

  ngOnInit() {
    this.windowsSubscription = this.windowManager.getWindows().subscribe(windows => {
      this.windows = windows; // Show all windows in taskbar
    });

    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy() {
    this.windowsSubscription?.unsubscribe();
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  getWindowTitle(type: string): string {
    return this.windowManager.getWindowTitle(type);
  }

  restoreWindow(windowId: string) {
    const allWindows = this.windowManager.getWindowsValue();
    const window = allWindows.find(w => w.id === windowId);
    if (window) {
      window.minimized = false;
      this.windowManager.bringToFront(windowId);
    }
  }

  onStartMenuOpen(type: string) {
    this.openWindow.emit(type);
  }
}

