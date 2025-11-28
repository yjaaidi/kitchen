import { CodegenConfig } from '@graphql-codegen/cli';
import { join } from 'node:path';

export default {
  documents: [join(__dirname, 'src/infra/**/*.ts')],
  generates: { [join(__dirname, 'src/generated/')]: { preset: 'client' } },
  schema: 'https://swapi-graphql.netlify.app/graphql',
} satisfies CodegenConfig;
