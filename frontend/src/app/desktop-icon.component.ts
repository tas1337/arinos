import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-desktop-icon',
  templateUrl: './desktop-icon.component.html',
  styleUrls: ['./desktop-icon.component.css']
})
export class DesktopIconComponent {
  @Input() icon: string = '';
  @Input() label: string = '';
  @Output() doubleClick = new EventEmitter<void>();

  onDoubleClick() {
    this.doubleClick.emit();
  }
}



