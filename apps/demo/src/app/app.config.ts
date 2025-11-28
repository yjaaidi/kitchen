import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { InMemoryCache } from '@apollo/client';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideApollo(() => {
      return {
        link: inject(HttpLink).create({
          uri: 'https://swapi-graphql.netlify.app/graphql',
        }),
        cache: new InMemoryCache(),
      };
    }),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
  ],
};
