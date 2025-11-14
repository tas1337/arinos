import { Component } from '@angular/core';

@Component({
  selector: 'app-files-window-content',
  templateUrl: './files-window-content.component.html',
  styleUrls: ['./files-window-content.component.css']
})
export class FilesWindowContentComponent {
  folders = [
    { name: 'Documents', icon: '📄', items: 12 },
    { name: 'Pictures', icon: '🖼️', items: 45 },
    { name: 'Downloads', icon: '⬇️', items: 8 },
    { name: 'Desktop', icon: '🖥️', items: 6 }
  ];

  recentFiles = [
    { name: 'resume.pdf', icon: '📄', size: '2.3 MB', date: 'Today' },
    { name: 'encoded_image.png', icon: '🖼️', size: '1.8 MB', date: 'Today' },
    { name: 'project.zip', icon: '📦', size: '5.2 MB', date: 'Yesterday' }
  ];
}

