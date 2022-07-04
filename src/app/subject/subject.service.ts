import {Injectable} from '@angular/core';
import {ContextStorageService} from "../shared/context-storage/context-storage.service";
import {NewSubject, Subject} from "./subject";

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private key = 'subjects';

  constructor(
    private contextStorageService: ContextStorageService<Subject, NewSubject>
  ) { }

  get(): Subject[] {
    return this.contextStorageService.get(this.key)
      .map(s => {
        return {...s, date: new Date(s.date)}
      });
  }

  getById(id: string): Subject | null {
    return this.contextStorageService.getById(this.key, id);
  }

  add(subject: NewSubject): void {
    this.contextStorageService.add(this.key, subject);
  }

  addInDays(subject: NewSubject, days: number[]): void {
    const subjects = days.map(d => {
      const date = subject.date.clone().addDays(d);
      return {...subject, date};
    });

    subjects.forEach(s => this.add(s));
  }

  deleteById(id: string): void {
    this.contextStorageService.deleteById(this.key, id);
  }

  deleteByName(name: string): void {
    this.get()
      .filter(s => s.name === name)
      .forEach(s => this.deleteById(s.id));
  }
}
