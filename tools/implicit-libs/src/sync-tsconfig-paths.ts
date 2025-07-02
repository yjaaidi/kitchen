import { formatFiles, logger, readJson, Tree, writeJson } from '@nx/devkit';
import { join } from 'node:path/posix';
import { SyncGeneratorResult } from 'nx/src/utils/sync-generators';
import { parsePath, PROJECTS_ROOT } from './strategy';
import { ProjectRepository } from './project-repository';
import { ProjectRepositoryImpl } from './project-repository.impl';

export default async function (
  tree: Tree,
  _: unknown,
  deps: {
    projectRepository?: ProjectRepository;
  } = {},
): Promise<SyncGeneratorResult> {
  const projectRepository =
    deps.projectRepository ?? new ProjectRepositoryImpl();

  const projects = await projectRepository.getProjects();

  const packageJson = readJson<{ name?: string }>(tree, 'package.json');
  if (!packageJson.name?.startsWith('@')) {
    throw new Error(
      'package.json must have a name with a scope (e.g. @marmicode/source).',
    );
  }
  const npmScope = packageJson.name.split('/')[0];

  const mappings: Mapping[] = projects
    .filter((project) => project.root.split('/')[0] === PROJECTS_ROOT)
    .map((project) => {
      return tree
        .children(project.root)
        .filter((f) => f.endsWith('.ts'))
        .map((entrypoint) => {
          const entrypointPath = join(project.root, entrypoint);
          const { scope, name } = parsePath(entrypointPath);
          const entrypointSuffix =
            entrypoint === 'index.ts'
              ? ''
              : `/${entrypoint.replace('.ts', '')}`;
          const alias = `${npmScope}/${scope}/${name}${entrypointSuffix}`;
          return {
            alias,
            path: entrypointPath,
          };
        });
    })
    .flat();

  updateTsconfigPaths(tree, mappings);

  if (tree.listChanges().length > 0) {
    await formatFiles(tree, {
      sortRootTsconfigPaths: true,
    });
  }

  return {
    outOfSyncMessage: `tsconfig's paths are out of sync`,
  };
}

interface Mapping {
  alias: string;
  path: string;
}

function findTsconfigPath(tree: Tree) {
  const tsconfigBasePath = 'tsconfig.base.json';
  if (tree.exists(tsconfigBasePath)) {
    return tsconfigBasePath;
  }

  logger.warn(
    `No tsconfig.base.json found, falling back to tsconfig.json as the base tsconfig file.`,
  );

  const tsconfigPath = 'tsconfig.json';
  if (!tree.exists(tsconfigPath)) {
    throw new Error(
      `No tsconfig.base.json found, please create one in the root of your project.`,
    );
  }

  return tsconfigPath;
}

function updateTsconfigPaths(tree: Tree, mappings: Mapping[]) {
  const tsconfigPath = findTsconfigPath(tree);

  const tsconfigPathsRecord = mappings.reduce(
    (acc, mapping) => ({
      ...acc,
      [mapping.alias]: [mapping.path],
    }),
    {},
  );

  const config = readJson<TsconfigJson>(tree, tsconfigPath);

  const updatedConfig: TsconfigJson = {
    ...config,
    compilerOptions: {
      ...config.compilerOptions,
      paths: {
        ...tsconfigPathsRecord,
        ...config.compilerOptions?.paths,
      },
    },
  };

  if (JSON.stringify(updatedConfig) !== JSON.stringify(config)) {
    writeJson(tree, tsconfigPath, updatedConfig);
  }
}

interface TsconfigJson {
  compilerOptions?: {
    paths?: Record<string, string[]>;
  };
}
