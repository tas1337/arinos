import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Menu } from './menu-bar.component';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
export class WindowComponent implements OnInit, OnDestroy {
  @Input() title: string = '';
  @Input() width: number = 600;
  @Input() height: number = 500;
  @Input() x: number = 100;
  @Input() y: number = 100;
  @Input() minimized: boolean = false;
  @Input() maximized: boolean = false;
  @Input() windowType: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() minimize = new EventEmitter<void>();
  @Output() maximize = new EventEmitter<void>();
  @Output() positionChange = new EventEmitter<{x: number, y: number}>();
  @Output() sizeChange = new EventEmitter<{width: number, height: number}>();
  @Output() focus = new EventEmitter<void>();

  isDragging = false;
  isResizing = false;
  dragStartX = 0;
  dragStartY = 0;
  resizeStartX = 0;
  resizeStartY = 0;
  resizeStartWidth = 0;
  resizeStartHeight = 0;
  resizeDirection = '';
  hasDragged = false;

  ngOnInit() {
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onMouseDown(event: MouseEvent, type: string) {
    if (type === 'drag') {
      this.hasDragged = false;
      this.isDragging = true;
      this.dragStartX = event.clientX - this.x;
      this.dragStartY = event.clientY - this.y;
    } else if (type.startsWith('resize')) {
      this.isResizing = true;
      this.resizeDirection = type;
      this.resizeStartX = event.clientX;
      this.resizeStartY = event.clientY;
      this.resizeStartWidth = this.width;
      this.resizeStartHeight = this.height;
    }
    event.preventDefault();
    event.stopPropagation();
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.hasDragged = true;
      // Calculate new position
      let newX = event.clientX - this.dragStartX;
      let newY = event.clientY - this.dragStartY;

      // Get viewport dimensions (account for taskbar at bottom)
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight - 48; // Taskbar height

      // Constrain position to viewport
      newX = Math.max(0, Math.min(newX, viewportWidth - this.width));
      newY = Math.max(0, Math.min(newY, viewportHeight - 32)); // At least show titlebar

      this.x = newX;
      this.y = newY;
      this.positionChange.emit({ x: this.x, y: this.y });
    } else if (this.isResizing) {
      const deltaX = event.clientX - this.resizeStartX;
      const deltaY = event.clientY - this.resizeStartY;

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight - 48; // Taskbar height

      // Store original values
      const originalX = this.x;
      const originalY = this.y;
      const originalWidth = this.width;
      const originalHeight = this.height;
      
      if (this.resizeDirection.includes('right')) {
        // Limit width to not exceed viewport
        const maxWidth = viewportWidth - this.x;
        this.width = Math.max(400, Math.min(maxWidth, this.resizeStartWidth + deltaX));
      }
      if (this.resizeDirection.includes('left')) {
        const newWidth = Math.max(400, this.resizeStartWidth - deltaX);
        const newX = this.x + (this.width - newWidth);
        // Don't allow resizing beyond left edge
        if (newX >= 0) {
          this.x = newX;
          this.width = newWidth;
        }
      }
      if (this.resizeDirection.includes('bottom')) {
        // Limit height to not exceed viewport
        const maxHeight = viewportHeight - this.y;
        this.height = Math.max(300, Math.min(maxHeight, this.resizeStartHeight + deltaY));
      }
      if (this.resizeDirection.includes('top')) {
        const newHeight = Math.max(300, this.resizeStartHeight - deltaY);
        const newY = this.y + (this.height - newHeight);
        // Don't allow resizing beyond top edge
        if (newY >= 0) {
          this.y = newY;
          this.height = newHeight;
        }
      }

      // Emit changes if any dimension changed
      if (this.width !== originalWidth || this.height !== originalHeight) {
        this.sizeChange.emit({ width: this.width, height: this.height });
      }
      if (this.x !== originalX || this.y !== originalY) {
        this.positionChange.emit({ x: this.x, y: this.y });
      }
    }
  }

  onMouseUp() {
    this.isDragging = false;
    this.isResizing = false;
  }

  onClose() {
    this.close.emit();
  }

  onMinimize() {
    this.minimize.emit();
  }

  onMaximize() {
    this.maximize.emit();
  }

  onTitleBarDoubleClick() {
    // Double-clicking title bar toggles maximize/restore, just like Windows
    // Only maximize if user didn't drag the window
    if (!this.hasDragged) {
      this.maximize.emit();
    }
    this.hasDragged = false;
  }

  getMenus(): Menu[] {
    // Default menus for all windows
    const baseMenus: Menu[] = [
      {
        label: 'File',
        items: [
          { label: 'New', action: 'file-new', icon: '📄' },
          { label: 'Open', action: 'file-open', icon: '📂' },
          { label: 'Save', action: 'file-save', icon: '💾' },
          { label: 'Save As...', action: 'file-save-as', icon: '💾' },
          { separator: true },
          { label: 'Print', action: 'file-print', icon: '🖨️', disabled: true },
          { separator: true },
          { label: 'Exit', action: 'file-exit', icon: '🚪' }
        ]
      },
      {
        label: 'Edit',
        items: [
          { label: 'Undo', action: 'edit-undo', icon: '↶', disabled: true },
          { label: 'Redo', action: 'edit-redo', icon: '↷', disabled: true },
          { separator: true },
          { label: 'Cut', action: 'edit-cut', icon: '✂️' },
          { label: 'Copy', action: 'edit-copy', icon: '📋' },
          { label: 'Paste', action: 'edit-paste', icon: '📄' },
          { separator: true },
          { label: 'Select All', action: 'edit-select-all', icon: '☑️' },
          { label: 'Find', action: 'edit-find', icon: '🔍' },
          { label: 'Replace', action: 'edit-replace', icon: '🔄' }
        ]
      },
      {
        label: 'View',
        items: [
          { label: 'Zoom In', action: 'view-zoom-in', icon: '🔍+' },
          { label: 'Zoom Out', action: 'view-zoom-out', icon: '🔍-' },
          { label: 'Reset Zoom', action: 'view-zoom-reset', icon: '🔍' },
          { separator: true },
          { label: 'Full Screen', action: 'view-fullscreen', icon: '⛶' },
          { separator: true },
          { 
            label: 'Layout', 
            icon: '📐',
            submenu: [
              { label: 'Cascade', action: 'layout-cascade', icon: '📑' },
              { label: 'Tile Horizontal', action: 'layout-tile-h', icon: '⬌' },
              { label: 'Tile Vertical', action: 'layout-tile-v', icon: '⬍' }
            ]
          }
        ]
      },
      {
        label: 'Tools',
        items: [
          { label: 'Options', action: 'tools-options', icon: '⚙️' },
          { label: 'Preferences', action: 'tools-preferences', icon: '🔧' },
          { separator: true },
          { label: 'Customize', action: 'tools-customize', icon: '🎨' }
        ]
      },
      {
        label: 'Help',
        items: [
          { label: 'Help Topics', action: 'help-topics', icon: '📖' },
          { label: 'About', action: 'help-about', icon: 'ℹ️' }
        ]
      }
    ];

    // Add window-specific menus based on type
    if (this.windowType === 'note') {
      baseMenus[0].items = [
        { label: 'New Note', action: 'file-new-note', icon: '📝' },
        { label: 'Open Note', action: 'file-open-note', icon: '📂' },
        { separator: true },
        { label: 'Save', action: 'file-save', icon: '💾' },
        { label: 'Save As...', action: 'file-save-as', icon: '💾' },
        { separator: true },
        { label: 'Exit', action: 'file-exit', icon: '🚪' }
      ];
    } else if (this.windowType === 'encode' || this.windowType === 'decode') {
      baseMenus[0].items = [
        { label: 'New', action: 'file-new', icon: '📄' },
        { label: 'Open Image', action: 'file-open-image', icon: '🖼️' },
        { separator: true },
        { label: 'Save Encoded Image', action: 'file-save-encoded', icon: '💾' },
        { separator: true },
        { label: 'Exit', action: 'file-exit', icon: '🚪' }
      ];
    }

    return baseMenus;
  }
}

