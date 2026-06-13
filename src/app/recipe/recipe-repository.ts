import { Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from './recipe';
import { RecipeFilter } from './recipe-filter';

export interface RecipeRepositoryDef {
  search(filter: RecipeFilter): Observable<Recipe[]>;
}

@Service()
export class RecipeRepository implements RecipeRepositoryDef {
  search(_filter: RecipeFilter = {}): Observable<Recipe[]> {
    throw new Error('Use RecipeRepositoryFake in this demo app.');
  }
}
