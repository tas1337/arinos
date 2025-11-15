import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { WindowManagerService } from '../services/window-manager.service';
import { WindowState } from '../models/window.model';
import { Subscription } from 'rxjs';

interface WifiNetwork {
  name: string;
  signal: number;
  secured: boolean;
  connected: boolean;
}

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
  
  // Volume control
  showVolumePopup = false;
  volumeLevel = 50;
  
  // WiFi control
  showWifiPopup = false;
  wifiNetworks: WifiNetwork[] = [];

  constructor(private windowManager: WindowManagerService) {}

  ngOnInit() {
    this.windowsSubscription = this.windowManager.getWindows().subscribe(windows => {
      this.windows = windows;
    });

    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
    
    // Get actual system volume if available
    this.initializeVolume();
    
    // Scan for WiFi networks
    this.scanWifiNetworks();
  }

  ngOnDestroy() {
    this.windowsSubscription?.unsubscribe();
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.showVolumePopup = false;
    this.showWifiPopup = false;
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  toggleVolume(event: Event) {
    event.stopPropagation();
    this.showVolumePopup = !this.showVolumePopup;
    this.showWifiPopup = false;
  }

  toggleWifi(event: Event) {
    event.stopPropagation();
    this.showWifiPopup = !this.showWifiPopup;
    this.showVolumePopup = false;
    if (this.showWifiPopup) {
      this.scanWifiNetworks();
    }
  }

  async initializeVolume() {
    // Load saved volume from localStorage or default to 50%
    const savedVolume = localStorage.getItem('systemVolume');
    this.volumeLevel = savedVolume ? parseInt(savedVolume, 10) : 50;
  }

  onVolumeChange() {
    // Simulated volume control - save to localStorage
    console.log('Volume set to:', this.volumeLevel);
    
    // Store in localStorage for persistence
    localStorage.setItem('systemVolume', this.volumeLevel.toString());
  }

  getVolumeIcon(): string {
    if (this.volumeLevel === 0) return '🔇';
    if (this.volumeLevel < 33) return '🔈';
    if (this.volumeLevel < 66) return '🔉';
    return '🔊';
  }

  async scanWifiNetworks() {
    // In a real app, this would use the Network Information API
    // For now, we'll simulate scanning for networks
    
    // Check if we can access network info
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    // Simulate WiFi networks (in production, would use actual WiFi API if available)
    this.wifiNetworks = [
      { name: connection?.effectiveType ? `Current Network (${connection.effectiveType})` : 'Current Network', signal: 5, secured: true, connected: true },
      { name: 'Home_Network_5G', signal: 4, secured: true, connected: false },
      { name: 'Office_WiFi', signal: 3, secured: true, connected: false },
      { name: 'Guest_Network', signal: 2, secured: false, connected: false },
      { name: 'Neighbor_WiFi', signal: 1, secured: true, connected: false }
    ];
  }

  getWifiIcon(signal: number): string {
    if (signal >= 5) return '📶';
    if (signal >= 4) return '📶';
    if (signal >= 3) return '📡';
    if (signal >= 2) return '📡';
    return '📶';
  }

  connectToWifi(network: WifiNetwork) {
    if (network.connected) return;
    
    // Mark all as disconnected
    this.wifiNetworks.forEach(n => n.connected = false);
    
    // Connect to selected
    network.connected = true;
    
    console.log('Connected to:', network.name);
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

