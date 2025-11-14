import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';

@Component({
  selector: 'app-desktop-icon',
  templateUrl: './desktop-icon.component.html',
  styleUrls: ['./desktop-icon.component.css']
})
export class DesktopIconComponent implements OnInit, OnDestroy {
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Output() doubleClick = new EventEmitter<void>();
  @Output() positionChange = new EventEmitter<{x: number, y: number}>();

  isDragging = false;
  dragStartX = 0;
  dragStartY = 0;
  currentX = 0;
  currentY = 0;
  lastClickTime = 0;
  hasMoved = false;
  mouseDownX = 0;
  mouseDownY = 0;

  ngOnInit() {
    this.currentX = this.x;
    this.currentY = this.y;
  }

  ngOnDestroy() {
    // Clean up any active drag
    if (this.isDragging) {
      document.removeEventListener('mousemove', this.onGlobalMouseMove);
      document.removeEventListener('mouseup', this.onGlobalMouseUp);
    }
  }

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    this.isDragging = false;
    this.hasMoved = false;
    this.mouseDownX = event.clientX;
    this.mouseDownY = event.clientY;
    this.dragStartX = event.clientX - this.currentX;
    this.dragStartY = event.clientY - this.currentY;

    // Bind methods for global listeners
    this.onGlobalMouseMove = this.onGlobalMouseMove.bind(this);
    this.onGlobalMouseUp = this.onGlobalMouseUp.bind(this);

    // Add global listeners
    document.addEventListener('mousemove', this.onGlobalMouseMove);
    document.addEventListener('mouseup', this.onGlobalMouseUp);

    // Handle double click detection
    const now = Date.now();
    if (now - this.lastClickTime < 300 && !this.hasMoved) {
      this.onDoubleClick();
      this.lastClickTime = 0;
      document.removeEventListener('mousemove', this.onGlobalMouseMove);
      document.removeEventListener('mouseup', this.onGlobalMouseUp);
    } else {
      this.lastClickTime = now;
    }
  }

  onGlobalMouseMove(event: MouseEvent) {
    if (!this.isDragging) {
      // Check if mouse has moved enough to start dragging
      const deltaX = Math.abs(event.clientX - this.mouseDownX);
      const deltaY = Math.abs(event.clientY - this.mouseDownY);
      if (deltaX > 5 || deltaY > 5) {
        this.hasMoved = true;
        this.isDragging = true;
      }
    }

    if (this.isDragging) {
      this.currentX = event.clientX - this.dragStartX;
      this.currentY = event.clientY - this.dragStartY;
      this.positionChange.emit({ x: this.currentX, y: this.currentY });
    }
  }

  onGlobalMouseUp() {
    if (this.isDragging) {
      this.isDragging = false;
    }
    document.removeEventListener('mousemove', this.onGlobalMouseMove);
    document.removeEventListener('mouseup', this.onGlobalMouseUp);
  }

  onDoubleClick() {
    this.doubleClick.emit();
  }
}



