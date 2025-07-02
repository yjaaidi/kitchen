import { readJson, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { describe, expect, it } from 'vitest';
import { FakeProjectRepository } from './project-repository.fake';
import syncTsconfigPathsGenerator from './sync-tsconfig-paths';

describe('sync-tsconfig-paths generator', () => {
  it('updates paths in tsconfig.base.json', async () => {
    const { fakeProjectRepository, tree, runGenerator } = setUp();

    writeJson(tree, 'tsconfig.base.json', {
      compilerOptions: {
        paths: {
          '@marmicode/something/else': ['something/else/index.ts'],
        },
      },
    });

    tree.write('src/recipes/core/index.ts', '');
    tree.write('src/recipes/core/testing.ts', '');
    tree.write('src/recipes/feature-search/index.ts', '');
    tree.write('src/recipes/infra/index.ts', '');

    /* The following files should be ignored. */
    tree.write('src/recipes/core/README.md', '');
    tree.write('src/recipes/core/internal/something.ts', '');

    fakeProjectRepository.configure({
      projects: [
        { name: 'core', root: 'src/recipes/core' },
        { name: 'feature-search', root: 'src/recipes/feature-search' },
        { name: 'infra', root: 'src/recipes/infra' },
      ],
    });

    await runGenerator();

    expect(readJson(tree, 'tsconfig.base.json')).toMatchObject({
      compilerOptions: {
        paths: {
          '@marmicode/recipes/core': ['src/recipes/core/index.ts'],
          '@marmicode/recipes/core/testing': ['src/recipes/core/testing.ts'],
          '@marmicode/recipes/feature-search': [
            'src/recipes/feature-search/index.ts',
          ],
          '@marmicode/recipes/infra': ['src/recipes/infra/index.ts'],
          '@marmicode/something/else': ['something/else/index.ts'],
        },
      },
    });
  });

  it('updates paths in tsconfig.json if tsconfig.base.json does not exist', async () => {
    const { fakeProjectRepository, tree, runGenerator } = setUp();

    fakeProjectRepository.configure({
      projects: [{ name: 'core', root: 'src/recipes/core' }],
    });
    tree.write('src/recipes/core/index.ts', '');

    tree.delete('tsconfig.base.json');

    writeJson(tree, 'tsconfig.json', {});

    await runGenerator();

    expect(readJson(tree, 'tsconfig.json')).toMatchObject({
      compilerOptions: {
        paths: {
          '@marmicode/recipes/core': ['src/recipes/core/index.ts'],
        },
      },
    });
  });
});

function setUp() {
  const tree = createTreeWithEmptyWorkspace();
  const fakeProjectRepository = new FakeProjectRepository();

  writeJson(tree, 'package.json', {
    name: '@marmicode/source',
  });

  return {
    fakeProjectRepository,
    runGenerator: async () => {
      await syncTsconfigPathsGenerator(
        tree,
        {},
        {
          projectRepository: fakeProjectRepository,
        },
      );
    },
    tree,
  };
}
