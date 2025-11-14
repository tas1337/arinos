import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-decode-window-content',
  templateUrl: './decode-window-content.component.html',
  styleUrls: ['./decode-window-content.component.css']
})
export class DecodeWindowContentComponent {
  @Input() decodeFile: File | null = null;
  @Input() decodePreviewUrl: string | null = null;
  @Input() decodedMessage: string | null = null;
  @Input() loading: boolean = false;

  @Output() fileSelected = new EventEmitter<Event>();
  @Output() decode = new EventEmitter<void>();

  isDragging = false;

  onFileSelected(event: Event) {
    this.fileSelected.emit(event);
    // Auto-decode when file is selected
    setTimeout(() => {
      this.decode.emit();
    }, 100);
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
