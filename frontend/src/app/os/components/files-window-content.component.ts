import { Component, OnInit } from '@angular/core';
import { WindowManagerService } from '../services/window-manager.service';
import { NoteService } from '../services/note.service';

interface FileItem {
  name: string;
  icon: string;
  size: string;
  date: string;
  type?: 'pdf' | 'image' | 'other' | 'note' | 'app';
}

interface Folder {
  name: string;
  icon: string;
  items: number;
}

@Component({
  selector: 'app-files-window-content',
  templateUrl: './files-window-content.component.html',
  styleUrls: ['./files-window-content.component.css']
})
export class FilesWindowContentComponent implements OnInit {
  folders: Folder[] = [
    { name: 'Desktop', icon: '🖥️', items: 0 },
    { name: 'Documents', icon: '📄', items: 0 },
    { name: 'Pictures', icon: '🖼️', items: 0 },
    { name: 'Downloads', icon: '⬇️', items: 0 }
  ];

  currentFolder: string = 'Desktop';
  currentFiles: FileItem[] = [];
  notes: any[] = [];

  constructor(
    private windowManager: WindowManagerService,
    private noteService: NoteService
  ) {}

  ngOnInit() {
    // Load notes for desktop view
    this.noteService.getNotes().subscribe(notes => {
      this.notes = notes;
      this.updateFolderItems();
      this.loadFolderFiles();
    });
  }

  updateFolderItems() {
    // Update item counts
    this.folders[0].items = 7 + this.notes.length; // Desktop: 7 apps + notes
    this.folders[1].items = 1; // Documents: resume.pdf
    this.folders[2].items = 0; // Pictures
    this.folders[3].items = 0; // Downloads
  }

  loadFolderFiles() {
    switch (this.currentFolder) {
      case 'Desktop':
        this.loadDesktopFiles();
        break;
      case 'Documents':
        this.loadDocumentsFiles();
        break;
      case 'Pictures':
        this.loadPicturesFiles();
        break;
      case 'Downloads':
        this.loadDownloadsFiles();
        break;
      default:
        this.currentFiles = [];
    }
  }

  loadDesktopFiles() {
    // Show desktop icons and notes
    const desktopApps: FileItem[] = [
      { name: 'How It Works', icon: '📖', size: 'App', date: '', type: 'app' },
      { name: 'Encode', icon: '🔒', size: 'App', date: '', type: 'app' },
      { name: 'Decode', icon: '🔓', size: 'App', date: '', type: 'app' },
      { name: 'Settings', icon: '⚙️', size: 'App', date: '', type: 'app' },
      { name: 'Files', icon: '📁', size: 'App', date: '', type: 'app' },
      { name: 'Browser', icon: '🌐', size: 'App', date: '', type: 'app' },
      { name: 'Resume', icon: '📄', size: 'PDF', date: '', type: 'pdf' }
    ];

    const noteFiles: FileItem[] = this.notes.map(note => ({
      name: note.name,
      icon: '📝',
      size: 'Note',
      date: new Date(note.updatedAt).toLocaleDateString(),
      type: 'note' as const
    }));

    this.currentFiles = [...desktopApps, ...noteFiles];
  }

  loadDocumentsFiles() {
    this.currentFiles = [
      { name: 'resume.pdf', icon: '📄', size: '2.3 MB', date: 'Today', type: 'pdf' }
    ];
  }

  loadPicturesFiles() {
    this.currentFiles = [
      { name: 'No pictures yet', icon: '🖼️', size: '', date: '', type: 'other' }
    ];
  }

  loadDownloadsFiles() {
    this.currentFiles = [
      { name: 'No downloads yet', icon: '⬇️', size: '', date: '', type: 'other' }
    ];
  }

  onFolderClick(folder: Folder) {
    this.currentFolder = folder.name;
    this.loadFolderFiles();
  }

  onFileClick(file: FileItem) {
    if (file.type === 'pdf') {
      // Open PDF in a window
      this.windowManager.openWindow('pdf', undefined, file.name);
    } else if (file.type === 'note') {
      // Open note in a window
      const note = this.notes.find(n => n.name === file.name);
      if (note) {
        this.windowManager.openWindow('note', note.id);
      }
    } else if (file.type === 'app') {
      // Open app window
      const appMap: { [key: string]: string } = {
        'How It Works': 'help',
        'Encode': 'encode',
        'Decode': 'decode',
        'Settings': 'settings',
        'Files': 'files',
        'Browser': 'browser',
        'Resume': 'resume'
      };
      const appType = appMap[file.name];
      if (appType) {
        if (appType === 'resume') {
          this.windowManager.openWindow('pdf', undefined, 'resume.pdf');
        } else {
          this.windowManager.openWindow(appType as any);
        }
      }
    } else if (file.type === 'image') {
      // Could open image viewer in the future
      console.log('Opening image:', file.name);
    } else {
      console.log('Opening file:', file.name);
    }
  }
}

