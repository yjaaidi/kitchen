import { Injectable } from '@angular/core';
import { LocalStorage } from './local-storage';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageFake implements LocalStorage {
  private _map = new Map<string, string>();

  setItem(key: string, value: string) {
    this._map.set(key, value);
  }

  getItem(key: string) {
    return this._map.get(key) ?? null;
  }
}

export function provideLocalStorageFake() {
  return {
    provide: LocalStorage,
    useClass: LocalStorageFake,
  };
}
