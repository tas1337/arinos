import { Component, Input, HostListener } from '@angular/core';

export interface MenuItem {
  label?: string;
  action?: string;
  icon?: string;
  disabled?: boolean;
  separator?: boolean;
  submenu?: MenuItem[];
}

export interface Menu {
  label: string;
  items: MenuItem[];
}

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent {
  @Input() menus: Menu[] = [];
  
  activeMenu: string | null = null;
  activeSubmenu: MenuItem | null = null;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Don't close if clicking within menu bar or dropdown
    if (!target.closest('.menu-bar') && !target.closest('.menu-dropdown') && !target.closest('.menu-submenu')) {
      this.closeAllMenus();
    }
  }

  onMenuClick(menuLabel: string, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    // Use setTimeout to ensure the click event completes before opening dropdown
    setTimeout(() => {
      if (this.activeMenu === menuLabel) {
        this.closeAllMenus();
      } else {
        this.activeMenu = menuLabel;
        this.activeSubmenu = null;
      }
    }, 0);
  }

  onMenuItemHover(item: MenuItem) {
    if (item.submenu && item.submenu.length > 0) {
      this.activeSubmenu = item;
    } else {
      this.activeSubmenu = null;
    }
  }

  onMenuItemClick(item: MenuItem, event: MouseEvent) {
    event.stopPropagation();
    
    if (item.action && !item.disabled) {
      // Emit action event or handle it
      console.log('Menu action:', item.action);
      this.closeAllMenus();
    }
    
    if (!item.submenu || item.submenu.length === 0) {
      this.closeAllMenus();
    }
  }

  closeAllMenus() {
    this.activeMenu = null;
    this.activeSubmenu = null;
  }

  getMenuItems(menuLabel: string): MenuItem[] {
    const menu = this.menus.find(m => m.label === menuLabel);
    return menu ? menu.items : [];
  }

  getDropdownPosition(menuLabel: string): number {
    // Calculate position based on which menu was clicked
    let position = 0;
    for (const menu of this.menus) {
      if (menu.label === menuLabel) {
        break;
      }
      // Approximate width per menu item (would need actual measurement in production)
      position += 70;
    }
    return Math.max(0, position);
  }

  getSubmenuPosition(): number {
    // Position submenu to the right of the dropdown
    return 200;
  }

  getSubmenuTopPosition(item: MenuItem): number {
    // Calculate vertical position based on which item is hovered
    const menu = this.menus.find(m => m.label === this.activeMenu);
    if (!menu) return 0;
    
    const itemIndex = menu.items.findIndex(i => i === item);
    return itemIndex * 32 + 4; // Approximate item height
  }
}

