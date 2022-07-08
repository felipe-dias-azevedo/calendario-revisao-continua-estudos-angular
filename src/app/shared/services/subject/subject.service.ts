import {Injectable} from '@angular/core';
import {ContextStorageService} from "../context-storage/context-storage.service";
import {NewSubject, PreSubject, Subject} from "./subject";
import {v4 as uuid} from "uuid";

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private key = 'subjects';

  constructor(
    private contextStorageService: ContextStorageService<PreSubject, Subject>
  ) { }

  get(): Subject[] {
    return this.contextStorageService.get(this.key)
      .map(s => {
        return {...s, date: new Date(s.date)}
      });
  }

  getById(id: string): Subject | null {
    const subject = this.contextStorageService.getById(this.key, id);

    if (subject === null) {
      return null;
    }

    return {...subject, date: new Date(subject.date)};
  }

  getByParentId(parentId: string): Subject[] {
     return this.contextStorageService.get(this.key)
       .filter(s => s.parentId === parentId)
       .map(s => {
         return {...s, date: new Date(s.date)}
       });
  }

  add(subject: PreSubject): void {
    this.contextStorageService.add(this.key, subject);
  }

  addInDays(subject: NewSubject, days: number[]): void {
    const parentId = uuid();

    const subjects: PreSubject[] = days.map(d => {
      const date = subject.date.clone().addDays(d);
      return {...subject, date, parentId};
    });

    subjects.forEach(s => this.add(s));
  }

  update(id: string, subject: PreSubject): void {
    this.contextStorageService.update(this.key, id, subject);
  }

  updateByParentId(parentId: string, subject: PreSubject): void {
    this.get()
      .filter(s => s.parentId === parentId)
      .forEach(s => this.contextStorageService.update(this.key, s.id, {
        ...subject, date: s.date, parentId: s.parentId
      }));
  }

  deleteById(id: string): void {
    this.contextStorageService.deleteById(this.key, id);
  }

  deleteByParentId(parentId: string): void {
    this.get()
      .filter(s => s.parentId === parentId)
      .forEach(s => this.deleteById(s.id));
  }

  deleteByName(name: string): void {
    this.get()
      .filter(s => s.name === name)
      .forEach(s => this.deleteById(s.id));
  }

  deleteAll(): void {
    this.contextStorageService.deleteAll(this.key);
  }
}
