import {Injectable} from '@angular/core';
import {Materia, NewMateria} from "./materia";
import {ContextStorageService} from "../context-storage/context-storage.service";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MateriaService {

  private key = 'materias';

  private contextStorageService: ContextStorageService<NewMateria, Materia>;

  constructor() {
    this.contextStorageService = new ContextStorageService<NewMateria, Materia>(this.key);
  }

  get(): Observable<Materia[]> {
    return this.contextStorageService.get().pipe(
        map(x => x.filter(s => s.id !== undefined))
    );
  }

  getById(id: string): Observable<Materia | null> {
    return this.contextStorageService.getById(id);
  }

  add(materia: NewMateria): void {
    this.contextStorageService.add(materia);
  }

  addWithId(materia: Materia): void {
    this.contextStorageService.addWithId(materia);
  }

  deleteById(id: string): void {
    this.contextStorageService.deleteById(id);
  }

  deleteAll(): void {
    this.contextStorageService.deleteAll();
  }
}
