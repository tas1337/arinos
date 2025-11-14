import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-encode-window-content',
  templateUrl: './encode-window-content.component.html',
  styleUrls: ['./encode-window-content.component.css']
})
export class EncodeWindowContentComponent {
  @Input() message: string = '';
  @Input() encodeFile: File | null = null;
  @Input() encodePreviewUrl: string | null = null;
  @Input() encodedImageUrl: string | null = null;
  @Input() loading: boolean = false;

  @Output() messageChange = new EventEmitter<string>();
  @Output() fileSelected = new EventEmitter<Event>();
  @Output() encode = new EventEmitter<void>();

  isDragging = false;

  onMessageChange() {
    this.messageChange.emit(this.message);
  }

  onFileSelected(event: Event) {
    this.fileSelected.emit(event);
  }

  onEncode() {
    this.encode.emit();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const input = document.createElement('input');
        input.type = 'file';
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        const changeEvent = new Event('change', { bubbles: true });
        Object.defineProperty(changeEvent, 'target', { value: input, enumerable: true });
        this.onFileSelected(changeEvent as any);
      }
    }
  }
}
