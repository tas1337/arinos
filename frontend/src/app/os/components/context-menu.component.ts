import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

export interface ContextMenuItem {
  label?: string;
  action?: string;
  icon?: string;
  disabled?: boolean;
  separator?: boolean;
}

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent {
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Input() items: ContextMenuItem[] = [];
  @Output() itemClick = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.context-menu')) {
      this.closeMenu();
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  onDocumentRightClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.context-menu')) {
      this.closeMenu();
    }
  }

  onItemClick(action: string) {
    this.itemClick.emit(action);
    this.closeMenu();
  }

  closeMenu() {
    this.close.emit();
  }

  getMenuStyle(): { [key: string]: string } {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const menuWidth = 200;
    const menuHeight = this.items.length * 36 + 8;

    let left = this.x;
    let top = this.y;

    // Adjust if menu would go off screen
    if (left + menuWidth > screenWidth) {
      left = screenWidth - menuWidth - 10;
    }
    if (top + menuHeight > screenHeight) {
      top = screenHeight - menuHeight - 10;
    }

    return {
      left: `${left}px`,
      top: `${top}px`
    };
  }
}

