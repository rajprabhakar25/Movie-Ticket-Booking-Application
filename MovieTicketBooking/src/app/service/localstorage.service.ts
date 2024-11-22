import { Injectable } from '@angular/core';
import { AppComponent } from '../app.component';

class LocalStorage implements Storage {
  [name: string]: any;
  readonly length!: number;
  clear(): void {}
  getItem(key: string): string | null {
    return '';
  }
  key(index: number): string | null {
    return '';
  }
  removeItem(key: string): void {}
  setItem(key: string, value: string): void {}
}

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  private storage: Storage;

  constructor() {
    this.storage = new LocalStorage();

    AppComponent.isBrowser.subscribe((isBrowser) => {
      if (isBrowser) {
        this.storage = localStorage;
      }
    });
  }

  [name: string]: any;

  length!: number;

  clear(): void {
    this.storage.clear();
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  get(key: string): string | null {
    return this.storage.getItem(key);
  }

  set(key: string, value: any): void {
    return this.storage.setItem(key, value);
  }

  remove(key: string): void {
    return this.storage.removeItem(key);
  }
}
