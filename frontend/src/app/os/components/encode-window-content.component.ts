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
  @Output() reset = new EventEmitter<void>();

  isDragging = false;

  onMessageInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    console.log('Message input changed to:', target.value);
    this.messageChange.emit(target.value);
  }

  onFileSelected(event: Event) {
    this.fileSelected.emit(event);
  }

  onEncode() {
    this.encode.emit();
  }

  resetEncode() {
    this.reset.emit();
  }

  downloadAgain() {
    if (this.encodedImageUrl) {
      const link = document.createElement('a');
      link.href = this.encodedImageUrl;
      link.download = 'encoded.png';
      link.click();
    }
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
