import { inject, ResourceRef } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ResolveFn } from '@angular/router';
import { delay, of } from 'rxjs';

const recipeResolver: ResolveFn<RecipeResolverData> = () => {
  return rxResource({
    stream: () => {
      console.log('send request');
      return of(42).pipe(delay(3000));
    },
  });
};

const key = 'recipe' as const;

export const recipeResolverConfig = {
  [key]: recipeResolver,
};

export function injectRecipeResolverData() {
  return inject(ActivatedRoute).snapshot.data[key] as RecipeResolverData;
}

export type RecipeResolverData = ResourceRef<number | undefined>;
