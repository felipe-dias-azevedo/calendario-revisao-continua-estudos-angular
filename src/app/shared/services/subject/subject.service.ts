import {Injectable} from '@angular/core';
import {ContextStorageService} from "../context-storage/context-storage.service";
import {NewSubject, PreSubject, Subject} from "./subject";
import {v4 as uuid} from "uuid";
import {defaultIfEmpty, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private key = 'subjects';

  private contextStorageService: ContextStorageService<PreSubject, Subject>

  constructor() {
    this.contextStorageService = new ContextStorageService<PreSubject, Subject>(this.key);
  }

  get(): Observable<Subject[]> {
    return this.contextStorageService.get()
        .pipe(
            map(s => s.filter(s => s.id !== undefined && s.parentId !== undefined)
                .map(s => {
                  return {...s, date: new Date(s.date)}
                })
            )
        );
  }

  getById(id: string): Observable<Subject | null> {
    const subject = this.contextStorageService.getById(id);

    return subject.pipe(
        map(s => {
          return <Subject>{...s, date: s !== null ? new Date(s.date) : new Date()}
        }),
        defaultIfEmpty(null)
    );
  }

  getByParentId(parentId: string): Observable<Subject[]> {
     return this.contextStorageService.get()
         .pipe(
             map(s => s.filter(s => s.parentId === parentId)
                 .map(s => {
                   return {...s, date: new Date(s.date)}
                 }))
         );
  }

  private getByParentIdSync(parentId: string): Subject[] {
    return this.contextStorageService.getSync().filter(s => s.parentId === parentId);
  }

  add(subject: PreSubject): void {
    this.contextStorageService.add(subject);
  }

  addWithId(subject: PreSubject): void {
    this.contextStorageService.addWithId(subject);
  }

  addInDays(subject: NewSubject, days: number[]): string {
    const parentId = uuid();

    const subjects: PreSubject[] = days.map(d => {
      const date = subject.date.clone().addDays(d);
      return {...subject, date, parentId};
    });

    subjects.forEach(s => this.add(s));

    return parentId;
  }

  repeat(subjectStructure: NewSubject, oldSubjects: Subject[], newDays: number[], oldParentId: string): string {

    const parentId = uuid();
    const firstDate = subjectStructure.date.clone();

    this.deleteByParentId(oldParentId);

    const subjects: PreSubject[] = newDays.map(d => {
      const note = oldSubjects.find(s => s.date.isSameDate(firstDate.clone().addDays(d)));

      return {
        ...subjectStructure,
        date: firstDate.clone().addDays(d),
        parentId,
        notes: note?.notes ?? undefined
      };
    });

    subjects.forEach(s => this.add(s));

    return parentId;
  }

  update(id: string, subject: PreSubject): void {
    this.contextStorageService.update(id, subject);
  }

  updateByParentId(parentId: string, subject: PreSubject): void {
    const subjects = this.getByParentIdSync(parentId).map(s => {
      return <Subject>{ ...subject, date: s.date, parentId: s.parentId, notes: s.notes, id: s.id }
    });
    this.contextStorageService.updateAll(subjects);
  }

  deleteById(id: string): void {
    this.contextStorageService.deleteById(id);
  }

  deleteByParentId(parentId: string): void {
    this.getByParentIdSync(parentId)
        .forEach(s => this.deleteById(s.id));
  }

  deleteAll(): void {
    this.contextStorageService.deleteAll();
  }
}
