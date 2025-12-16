# FAQ

## `wm-recipe-filter` is not a known element

This is a shallow test. We don't want to load child components as they are probably not even implemented yet.

Apply `CUSTOM_ELEMENTS_SCHEMA` to allow unknown elements:

```typescript
TestBed.overrideComponent(MyThing, {
  set: {
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  },
});
```

## Not getting the expected result

- [ ] Did you wait for change detection to be triggered and the component to be stable `fixture.whenStable()`? or did you use a retry-able assertion such as `await expect.element(...)...` or `await expect.poll(() => ...)`?
- [ ] Did you `await` all functions that return a promise? (e.g. harnesses)

## How to stub a function that returns an observable?

You can use `of` function to create a hardcoded observable.

```typescript
stub.mockReturnValue(of(42));
```

## `Error: listen EACCES: permission denied`

Cf. [Vitest issue #9035](https://github.com/vitest-dev/vitest/issues/9035).

When using Vitest Browser mode on some systems, you may encounter the following error:

```
Error: listen EACCES: permission denied 127.0.0.1:63315
```

In this case, you can override the port using the `--browser.api.port` or the configuration file:

```ts
export default defineConfig({
  ...
  test: {
    ...
    browser: {
      ...
      api: {
        port: 63315,
      },
    },
  },
});
```
