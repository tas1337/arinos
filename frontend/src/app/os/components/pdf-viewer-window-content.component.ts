import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer-window-content',
  templateUrl: './pdf-viewer-window-content.component.html',
  styleUrls: ['./pdf-viewer-window-content.component.css']
})
export class PdfViewerWindowContentComponent {
  @Input() pdfPath: string = '';

  constructor(private sanitizer: DomSanitizer) {}

  getSafePdfUrl(): SafeResourceUrl {
    if (!this.pdfPath) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
    // Ensure path starts with /assets/ or is absolute
    let path = this.pdfPath.startsWith('/') ? this.pdfPath : `/assets/documents/${this.pdfPath}`;
    // Add #view=FitH to make PDF fit horizontally
    if (!path.includes('#')) {
      path += '#view=FitH';
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(path);
  }
}

