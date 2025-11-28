import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SwapiRepository } from '../infra/swapi.repository';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  template: `
    <h1>Films</h1>
    <ul>
      @for (film of films.value(); track film.title) {
      <li>{{ film.title }}</li>
      }
    </ul>
  `,
})
export class App {
  private _repository = inject(SwapiRepository);

  films = rxResource({
    stream: () => this._repository.getAllFilms(),
  });
}
