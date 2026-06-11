import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ComponentType, createElement, FC, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

export const createCommonTestWrapper = () =>
  mergeWrappers([
    defineWrapper(Provider, { store }),
    defineWrapper(QueryClientProvider, { client: new QueryClient() }),
  ]);

export type Wrapper = (children: ReactNode) => ReactNode;

export const mergeWrappers =
  (wrappers: Wrapper[]): FC<{ children: ReactNode }> =>
  ({ children }) =>
    wrappers.reduceRight(
      (wrappedChildren, wrapper) => wrapper(wrappedChildren),
      children,
    );

export function defineWrapper<Props extends object>(
  provider: ComponentType<Props & { children: ReactNode }>,
  props: Props,
): Wrapper {
  return (children) =>
    createElement(provider, Object.assign({}, props, { children }));
}
