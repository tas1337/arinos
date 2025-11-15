import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { NoteService, NoteFile } from '../services/note.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-note-window-content',
  templateUrl: './note-window-content.component.html',
  styleUrls: ['./note-window-content.component.css']
})
export class NoteWindowContentComponent implements OnInit, OnDestroy {
  @Input() noteId: string = '';
  @Output() close = new EventEmitter<void>();

  note: NoteFile | null = null;
  content: string = '';
  isRenaming: boolean = false;
  newName: string = '';
  private notesSubscription?: Subscription;

  constructor(private noteService: NoteService) {}

  ngOnInit() {
    this.loadNote();
    
    // Subscribe to note changes to update when renamed
    this.notesSubscription = this.noteService.getNotes().subscribe((notes: NoteFile[]) => {
      const updatedNote = notes.find((n: NoteFile) => n.id === this.noteId);
      if (updatedNote) {
        const wasRenaming = this.isRenaming;
        const oldName = this.note?.name;
        this.note = updatedNote;
        // Update name if not currently renaming and name changed
        if (!wasRenaming && updatedNote.name !== oldName) {
          this.newName = updatedNote.name;
        }
        // Note: We don't update content here to avoid overwriting user input
        // Content is saved on change via onContentChange()
      }
    });
  }

  ngOnDestroy() {
    this.notesSubscription?.unsubscribe();
  }

  private loadNote() {
    const notes = this.noteService.getNotesValue();
    this.note = notes.find((n: NoteFile) => n.id === this.noteId) || null;
    if (this.note) {
      this.content = this.note.content;
      this.newName = this.note.name;
    }
  }

  onContentChange() {
    if (this.note) {
      this.noteService.updateNote(this.note.id, { content: this.content });
    }
  }

  startRenaming() {
    if (this.note) {
      this.isRenaming = true;
      this.newName = this.note.name;
    }
  }

  saveRename() {
    if (this.note && this.newName.trim()) {
      this.noteService.updateNote(this.note.id, { name: this.newName.trim() });
      this.isRenaming = false;
    }
  }

  cancelRename() {
    if (this.note) {
      this.newName = this.note.name;
    }
    this.isRenaming = false;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey && this.isRenaming) {
      event.preventDefault();
      this.saveRename();
    } else if (event.key === 'Escape' && this.isRenaming) {
      this.cancelRename();
    }
  }
}

