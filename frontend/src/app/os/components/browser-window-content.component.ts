import { Component } from '@angular/core';

@Component({
  selector: 'app-browser-window-content',
  templateUrl: './browser-window-content.component.html',
  styleUrls: ['./browser-window-content.component.css']
})
export class BrowserWindowContentComponent {
  currentUrl: string = 'https://iliya.online';
  urlInput: string = 'https://iliya.online';

  navigate() {
    // Validate URL
    let url = this.urlInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    this.currentUrl = url;
  }

  onUrlKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.navigate();
    }
  }

  goBack() {
    // Browser back functionality would go here
    console.log('Go back');
  }

  goForward() {
    // Browser forward functionality would go here
    console.log('Go forward');
  }

  refresh() {
    // Refresh iframe
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.src = iframe.src;
    }
  }
}

