import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-tutorial-overlay',
  templateUrl: './tutorial-overlay.component.html',
  styleUrls: ['./tutorial-overlay.component.css']
})
export class TutorialOverlayComponent implements OnInit, OnDestroy {
  showTutorial = false;

  private closeTutorialHandler = () => {
    this.closeTutorial();
  };

  ngOnInit() {
    // Show tutorial every time the page loads
    setTimeout(() => {
      this.showTutorial = true;
      this.notifyTutorialState();
    }, 500);

    // Listen for close event from opening encode/decode windows
    window.addEventListener('closeTutorial', this.closeTutorialHandler);
  }

  private notifyTutorialState() {
    window.dispatchEvent(new CustomEvent('tutorialStateChange', {
      detail: { show: this.showTutorial }
    }));
  }

  ngOnDestroy() {
    window.removeEventListener('closeTutorial', this.closeTutorialHandler);
  }

  closeTutorial() {
    this.showTutorial = false;
    this.notifyTutorialState();
    // Don't save to localStorage - show every time
  }

  getEncodeIconPosition(): { x: number, y: number } {
    // Encode icon is at position { id: 'encode', x: 20, y: 120 }
    return { x: 20, y: 120 };
  }

  getDecodeIconPosition(): { x: number, y: number } {
    // Decode icon is at position { id: 'decode', x: 20, y: 220 }
    return { x: 20, y: 220 };
  }

  getTutorialBoxPosition(): { x: number, y: number } {
    // Position tutorial box next to the icons (to the right of them)
    // Icons are at x: 20, encode at y: 120, decode at y: 220
    // Box should be positioned to the right of the icons
    const iconX = 20;
    const iconWidth = 80; // Icon width
    const iconSpacing = 20; // Space between icons and box
    const encodeY = 120;
    const decodeY = 220;
    const middleY = (encodeY + decodeY) / 2; // Middle point between icons
    
    return {
      x: iconX + iconWidth + iconSpacing, // To the right of icons
      y: middleY - 60 // Center vertically relative to the two icons
    };
  }
}

