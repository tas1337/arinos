import { Component, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-start-menu',
  templateUrl: './start-menu.component.html',
  styleUrls: ['./start-menu.component.css']
})
export class StartMenuComponent {
  @Output() openWindow = new EventEmitter<string>();
  
  isOpen = false;
  
  menuItems = [
    { icon: '📖', label: 'How It Works', action: 'help' },
    { icon: '🔒', label: 'Encode Message', action: 'encode' },
    { icon: '🔓', label: 'Decode Message', action: 'decode' },
    { separator: true },
    { icon: '⚙️', label: 'Settings', action: 'settings' },
    { icon: '📁', label: 'Files', action: 'files' },
    { separator: true },
    { icon: '🚀', label: 'Deploy', action: 'deploy' },
    { icon: '❌', label: 'Shut Down', action: 'shutdown' }
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

  onItemClick(action: string) {
    if (action !== 'shutdown' && action !== 'settings' && action !== 'files' && action !== 'deploy') {
      this.openWindow.emit(action);
    }
    this.close();
  }
}

