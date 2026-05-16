const OVERRIDE_METHOD = Symbol('singleton:override');
const RESET_METHOD = Symbol('singleton:reset');

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

export const singletonTestingUtils = {
  override<T>(singleton: Singleton<T>, factory: () => T): void {
    (singleton as _SingletonInternal<T>)[OVERRIDE_METHOD](factory);
  },

  reset(): void {
    for (const s of overriddenSingletons) {
      s[RESET_METHOD]();
    }
    overriddenSingletons.clear();
  },
};

const overriddenSingletons = new Set<_SingletonInternal<unknown>>();
