import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';

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
      this.x = event.clientX - this.dragStartX;
      this.y = event.clientY - this.dragStartY;
      this.positionChange.emit({ x: this.x, y: this.y });
    } else if (this.isResizing) {
      const deltaX = event.clientX - this.resizeStartX;
      const deltaY = event.clientY - this.resizeStartY;
      
      if (this.resizeDirection.includes('right')) {
        this.width = Math.max(400, this.resizeStartWidth + deltaX);
      }
      if (this.resizeDirection.includes('left')) {
        const newWidth = Math.max(400, this.resizeStartWidth - deltaX);
        this.x = this.x + (this.width - newWidth);
        this.width = newWidth;
      }
      if (this.resizeDirection.includes('bottom')) {
        this.height = Math.max(300, this.resizeStartHeight + deltaY);
      }
      if (this.resizeDirection.includes('top')) {
        const newHeight = Math.max(300, this.resizeStartHeight - deltaY);
        this.y = this.y + (this.height - newHeight);
        this.height = newHeight;
      }
      
      this.sizeChange.emit({ width: this.width, height: this.height });
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
}

