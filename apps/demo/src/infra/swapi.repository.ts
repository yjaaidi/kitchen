import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { graphql } from '../generated/gql';

const GET_ALL_FILMS = graphql(`
  query GetAllFilms {
    allFilms {
      films {
        title
      }
    }
  }
`);

@Injectable({ providedIn: 'root' })
export class SwapiRepository {
  private _apollo = inject(Apollo);

  getAllFilms(): Observable<Film[] | undefined> {
    return this._apollo.query({ query: GET_ALL_FILMS }).pipe(
      map(({ data }) =>
        data?.allFilms?.films?.map((film) => ({
          title: film?.title,
        }))
      )
    );
  }
}

export interface Film {
  title?: string | null;
}
