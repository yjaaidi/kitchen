const OVERRIDE_METHOD = Symbol('singleton:override');
const RESET_METHOD = Symbol('singleton:reset');

/**
 * Defines a singleton using a factory function.
 *
 * @example
 * const singleton = defineSingleton(() => new MyClass());
 * const instance = singleton.get();
 */
export function defineSingleton<T>(factory: () => T): Singleton<T> {
  let currentFactory = factory;
  const originalFactory = factory;
  let instance: T | undefined;

  const singleton: _SingletonInternal<T> = {
    get() {
      return instance ?? (instance = currentFactory());
    },

    [OVERRIDE_METHOD](newFactory: () => T) {
      if (instance !== undefined) {
        throw new Error(
          `Can't override singleton that has already been initialized.`,
        );
      }
      currentFactory = newFactory;
      overriddenSingletons.add(singleton);
    },

    [RESET_METHOD]() {
      currentFactory = originalFactory;
      instance = undefined;
    },
  };

  return singleton;
}

export type Singleton<T> = Pick<_SingletonInternal<T>, 'get'>;

interface _SingletonInternal<T> {
  get(): T;
  [OVERRIDE_METHOD](factory: () => T): void;
  [RESET_METHOD](): void;
}

/**
 * A separate set of utilities for testing singletons.
 * This should not be used in production code.
 */
export const singletonTestingUtils = {
  /**
   * Override a singleton with a new factory function.
   *
   * Note that a singleton can't be overridden if it has already been initialized.
   *
   * @param singleton - The singleton to override.
   * @param factory - The factory function to override the singleton with.
   */
  override<T>(singleton: Singleton<T>, factory: () => T): void {
    (singleton as _SingletonInternal<T>)[OVERRIDE_METHOD](factory);
  },

  /**
   * Reset all overridden singletons to their original factory functions.
   */
  reset(): void {
    for (const s of overriddenSingletons) {
      s[RESET_METHOD]();
    }
    overriddenSingletons.clear();
  },
};

const overriddenSingletons = new Set<_SingletonInternal<unknown>>();
