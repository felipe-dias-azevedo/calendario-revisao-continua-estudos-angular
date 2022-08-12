import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DarkmodeService {

  private readonly key = 'darkmode';

  private darkModeState!: BehaviorSubject<boolean>;
  private model!: Observable<boolean>;

  constructor() {
    const data = localStorage.getItem(this.key);
    if (data === null) {
      const darkMode = this.getDeviceTheme();
      this.init(darkMode);
      return;
    }

    const value = data === 'true';
    this.init(value);
  }

  private getDeviceTheme(): boolean {
    if (window.matchMedia('(prefers-color-scheme)').media === 'not all') {
      return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private init(value: boolean) {
    this.darkModeState = new BehaviorSubject<boolean>(value);
    this.model = this.darkModeState.asObservable();
  }

  get() {
    return this.model;
  }

  toggle() {
    const value = !this.darkModeState.value;
    this.darkModeState.next(value);
    localStorage.setItem(this.key, '' + value);
  }

  reset() {
    const value = this.getDeviceTheme();
    this.darkModeState.next(value);
    localStorage.removeItem(this.key);
  }
}
