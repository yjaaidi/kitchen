import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
  useFactory: () => localStorage,
})
export abstract class LocalStorage {
  abstract setItem(key: string, value: string): void;
  abstract getItem(key: string): string | null;
}
