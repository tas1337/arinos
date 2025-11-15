import { Component, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-start-menu',
  templateUrl: './start-menu.component.html',
  styleUrls: ['./start-menu.component.css']
})
export class StartMenuComponent {
  @Output() openWindow = new EventEmitter<string>();
  
  isOpen = false;
  searchQuery: string = '';
  
  pinnedApps = [
    { icon: '📖', label: 'How It Works', action: 'help' },
    { icon: '🔒', label: 'Encode', action: 'encode' },
    { icon: '🔓', label: 'Decode', action: 'decode' },
    { icon: '⚙️', label: 'Settings', action: 'settings' },
    { icon: '📁', label: 'Files', action: 'files' },
    { icon: '🌐', label: 'Browser', action: 'browser' }
  ];

  recommendedItems = [
    { icon: '📄', label: 'Document', meta: 'Recently opened', action: 'document' },
    { icon: '🖼️', label: 'Image', meta: 'Opened today', action: 'image' }
  ];

  newsItems = [
    { title: 'AI Technology Advances', source: 'Tech News' },
    { title: 'Steganography in Security', source: 'Security Weekly' },
    { title: 'Latest Updates', source: 'Tech Daily' }
  ];

  toggle() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.isOpen && !target.closest('.start-menu') && !target.closest('.menu-panel') && !target.closest('.menu-overlay')) {
      this.close();
    }
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    // Add search functionality here if needed
  }

  onItemClick(action: string) {
    if (action === 'help' || action === 'encode' || action === 'decode' || action === 'settings' || action === 'files' || action === 'browser') {
      this.openWindow.emit(action);
    }
    this.close();
  }
}
