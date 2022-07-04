import { Injectable } from '@angular/core';
import {ContextStorageService} from "../shared/context-storage/context-storage.service";
import {NewSubtopic, Subtopic} from "./subtopic";

@Injectable({
  providedIn: 'root'
})
export class SubtopicService {

  private key = 'subtopics';

  constructor(private contextStorageService: ContextStorageService<Subtopic, NewSubtopic>) { }

  get(): Subtopic[] {
    return this.contextStorageService.get(this.key);
  }

  getById(id: string): Subtopic | null {
    return this.contextStorageService.getById(this.key, id);
  }

  add(materia: NewSubtopic): void {
    this.contextStorageService.add(this.key, materia);
  }

  deleteById(id: string): void {
    this.contextStorageService.deleteById(this.key, id);
  }
}
