import { Injectable } from '@angular/core';
import {v4 as uuid} from "uuid";
import {IdentifiableContext} from "./identifiable-context";

@Injectable({
  providedIn: 'root'
})
export class ContextStorageService <T extends IdentifiableContext, NT> {

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

  add(key: string, content: NT): void {
    const newContent = { id: uuid(), ...content };
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
