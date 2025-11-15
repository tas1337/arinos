import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NoteFile {
  id: string;
  name: string;
  content: string;
  x: number;
  y: number;
  createdAt: number;
  updatedAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private notes$ = new BehaviorSubject<NoteFile[]>([]);
  private readonly STORAGE_KEY = 'arinos_notes';

  constructor() {
    this.loadNotes();
  }

  getNotes(): Observable<NoteFile[]> {
    return this.notes$.asObservable();
  }

  getNotesValue(): NoteFile[] {
    return this.notes$.value;
  }

  createNote(name: string = 'New Note', x: number = 20, y: number = 20): NoteFile {
    const now = Date.now();
    const note: NoteFile = {
      id: `note-${now}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      content: '',
      x,
      y,
      createdAt: now,
      updatedAt: now
    };

    const notes = [...this.notes$.value, note];
    this.notes$.next(notes);
    this.saveNotes(notes);
    return note;
  }

  updateNote(id: string, updates: Partial<NoteFile>): void {
    const notes = this.notes$.value.map(note => {
      if (note.id === id) {
        return {
          ...note,
          ...updates,
          updatedAt: Date.now()
        };
      }
      return note;
    });
    this.notes$.next(notes);
    this.saveNotes(notes);
  }

  deleteNote(id: string): void {
    const notes = this.notes$.value.filter(note => note.id !== id);
    this.notes$.next(notes);
    this.saveNotes(notes);
  }

  updateNotePosition(id: string, x: number, y: number): void {
    this.updateNote(id, { x, y });
  }

  private loadNotes(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const notes = JSON.parse(stored);
        this.notes$.next(notes);
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  }

  private saveNotes(notes: NoteFile[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  }
}


