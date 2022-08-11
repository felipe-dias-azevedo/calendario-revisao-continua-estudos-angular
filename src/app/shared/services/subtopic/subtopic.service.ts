import { Injectable } from '@angular/core';
import {ContextStorageService} from "../context-storage/context-storage.service";
import {NewSubtopic, Subtopic} from "./subtopic";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SubtopicService {

  private key = 'subtopics';

  private contextStorageService: ContextStorageService<NewSubtopic, Subtopic>;

  constructor() {
    this.contextStorageService = new ContextStorageService<NewSubtopic, Subtopic>(this.key);
  }

  get(): Observable<Subtopic[]> {
    return this.contextStorageService.get().pipe(
        map(x => x.filter(s => s.id !== undefined))
    );
  }

  getById(id: string): Observable<Subtopic | null> {
    return this.contextStorageService.getById(id);
  }

  add(materia: NewSubtopic): void {
    this.contextStorageService.add(materia);
  }

  addWithId(materia: NewSubtopic): void {
    this.contextStorageService.addWithId(materia);
  }

  deleteById(id: string): void {
    this.contextStorageService.deleteById(id);
  }

  deleteAll(): void {
    this.contextStorageService.deleteAll();
  }
}
