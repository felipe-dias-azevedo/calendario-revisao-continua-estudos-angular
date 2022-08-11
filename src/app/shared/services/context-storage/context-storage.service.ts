import {v4 as uuid} from "uuid";
import {IdentifiableContext} from "./identifiable-context";
import {BehaviorSubject, map, Observable} from "rxjs";

export class ContextStorageService <NT, T extends IdentifiableContext & NT> {

  private readonly key!: string;

  stateModel!: BehaviorSubject<T[]>;
  private readonly model!: Observable<T[]>;

  constructor(key: string) {
    this.key = key;

    const values = this.getData(this.key);
    this.stateModel = new BehaviorSubject<T[]>(values);
    this.model = this.stateModel.asObservable();
  }

  private getData(key: string): T[] {
    const contentString = localStorage.getItem(key);

    if (contentString === null) {
      return [];
    }

    return JSON.parse(contentString);
  }

  private updateStorage(content: T[]) {
    const jsonContent = JSON.stringify(content);
    localStorage.setItem(this.key, jsonContent);
  }

  get(): Observable<T[]> {
    return this.model;
  }

  getSync(): T[] {
    return this.stateModel.value;
  }

  getById(id: string): Observable<T | null> {
    return this.get()
        .pipe(
            map(c => c.find(m => m.id === id) ?? null)
        );
  }

  private addNew(newContent: T): void {
    const newContents: T[] = [...this.stateModel.value, newContent];
    this.stateModel.next(newContents);
    this.updateStorage(newContents);
  }

  add(content: NT): void {
    const newContent: T = <T>{ ...content, id: uuid() };

    this.addNew(newContent);
  }

  addWithId(content: NT): void {
    this.addNew(<T>{...content});
  }

  update(id: string, content: NT): void {
    const value = this.stateModel.value.find(m => m.id === id) ?? null;

    if (value === null) {
      return;
    }

    const updatedContent: T = { ...value, ...content, id };

    const newContents: T[] = [...this.stateModel.value.filter(m => m.id !== id), updatedContent];
    this.stateModel.next(newContents);
    this.updateStorage(newContents);
  }

  updateAll(content: T[]) {

    const contentsUpdated: T[] = content.map(nc => {
      const value = this.stateModel.value.find(m => m.id === nc.id)!;

      return <T>{ ...value, ...nc, id: nc.id };
    });

    const oldContents: T[] = this.stateModel.value.filter(v => !content.map(c => c.id).includes(v.id));

    const newContents: T[] = [...oldContents, ...contentsUpdated];
    this.stateModel.next(newContents);
    this.updateStorage(newContents);
  }

  deleteById(id: string): void {
    const newContent = this.stateModel.value.filter(m => m.id !== id);
    this.stateModel.next(newContent);
    this.updateStorage(newContent);
  }

  deleteAll(): void {
    const value: T[] = [];
    this.stateModel.next(value);
    this.updateStorage(value);
  }
}
