# How to Configure GraphQL Codegen

## 1. Install the dependencies

```sh
pnpm add -D @graphql-codegen/cli @graphql-typed-document-node/core
```

## 2. Create a `codegen.ts` file

```ts
import { CodegenConfig } from '@graphql-codegen/cli';
import { join } from 'node:path';

export default {
  /* These are the files where you have GraphQL queries such as `graphql(`query GetAllFilms { allFilms { films { title } } }`) `
   * Note that we are using the absolute path to be able to run the codegen from the root of the workspace.
   * When using Nx, you can create an Nx target that runs withing the project root. */
  documents: [join(__dirname, 'src/infra/**/*.ts')],

  /* This is the output directory for the generated files. */
  generates: { [join(__dirname, 'src/generated/')]: { preset: 'client' } },

  /* This is the URL of the GraphQL endpoint or the path to the schema file. */
  schema: 'https://swapi-graphql.netlify.app/graphql',
} satisfies CodegenConfig;
```

## 3. Run the codegen

```sh
pnpm graphql-codegen --config apps/demo/codegen.ts
```
