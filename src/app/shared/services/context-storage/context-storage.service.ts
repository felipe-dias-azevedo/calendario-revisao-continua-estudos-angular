import { Injectable } from '@angular/core';
import {v4 as uuid} from "uuid";
import {IdentifiableContext} from "./identifiable-context";

@Injectable({
  providedIn: 'root'
})
export class ContextStorageService <NT, T extends IdentifiableContext & NT> {

  constructor() { }

  get(key: string): T[] {
    const contentString = localStorage.getItem(key);

    if (contentString === null) {
      return [];
    }

    return JSON.parse(contentString);
  }

  getById(key: string, id: string): T | null {
    const contents = this.get(key);
    const content = contents.find(m => m.id === id);
    return content || null;
  }

  private addNew(key: string, newContent: IdentifiableContext & NT): void {
    const contentString = localStorage.getItem(key);

    if (contentString === null) {
      const jsonContent = JSON.stringify([newContent]);
      localStorage.setItem(key, jsonContent);
      return;
    }

    const oldContent: T[] = JSON.parse(contentString);
    const contents = [...oldContent, newContent];
    const jsonContent = JSON.stringify(contents);
    localStorage.setItem(key, jsonContent);
  }

  add(key: string, content: NT): void {
    const newContent: IdentifiableContext & NT = { ...content, id: uuid() };

    this.addNew(key, newContent);
  }

  update(key: string, id: string, content: NT): void {
    const value = this.getById(key, id);

    if (value === null) {
      return;
    }

    const updatedContent: T = { ...value, ...content, id };

    this.deleteById(key, id);

    this.addNew(key, updatedContent);
  }

  deleteById(key: string, id: string): void {
    const contentString = localStorage.getItem(key);

    if (contentString === null) {
      return;
    }

    let oldContent: T[] = JSON.parse(contentString);
    const contents = oldContent.filter(m => m.id !== id);
    const jsonContent = JSON.stringify(contents);
    localStorage.setItem(key, jsonContent);
  }

  deleteAll(key: string): void {
    localStorage.removeItem(key);
  }
}
