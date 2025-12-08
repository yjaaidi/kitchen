import { inject, Injectable } from '@angular/core';
import { RedirectCommand, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RedirectHelper {
  private _router = inject(Router);

  /**
   * @returns A redirect command that overrides the query params of the current route and keeps the path.
   */
  createRedirectOverridingQueryParams({
    state,
    queryParams,
  }: {
    state: RouterStateSnapshot;
    queryParams?: Record<string, string[]>;
  }) {
    const path = state.url.split('?')[0];
    const url = this._router.createUrlTree([path], { queryParams });
    return new RedirectCommand(url, {
      replaceUrl: true,
    });
  }
}
