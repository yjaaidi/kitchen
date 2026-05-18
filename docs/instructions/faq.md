# FAQ

## `Error: listen EACCES: permission denied`

🔗 [Vitest issue #9035](https://github.com/vitest-dev/vitest/issues/9035).

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
