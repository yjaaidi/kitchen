import { CreateNodesV2 } from '@nx/devkit';

export const createNodesV2: CreateNodesV2 = [
  'src/*/*/index.ts',
  (indexPathList: string[]) => {
    return indexPathList.map((indexPath) => {
      const [libs, scope, name] = indexPath.split('/');
      const projectRoot = `${libs}/${scope}/${name}`;
      const projectName = `${scope}-${name}`;
      const nameParts = name.split('-');
      const type = nameParts.at(-1);

      return [
        indexPath,
        {
          projects: {
            [projectRoot]: {
              name: projectName,
              sourceRoot: projectRoot,
              tags: [`scope:${scope}`, `type:${type}`],
              targets: {
                lint: {
                  command: 'eslint .',
                  options: {
                    cwd: projectRoot,
                  },
                  metadata: { technologies: ['eslint'] },
                  cache: true,
                  inputs: [
                    'default',
                    '^default',
                    '{workspaceRoot}/.eslintrc.json',
                    `{workspaceRoot}/${libs}/.eslintrc.json`,
                    '{workspaceRoot}/tools/eslint-rules/**/*',
                    {
                      externalDependencies: ['eslint'],
                    },
                  ],
                  outputs: ['{options.outputFile}'],
                },
                test: {
                  command: 'vitest',
                  metadata: { technologies: ['vitest'] },
                  options: {
                    cwd: projectRoot,
                    root: '.',
                  },
                  cache: true,
                  inputs: [
                    'default',
                    '^production',
                    '{workspaceRoot}/libs/vite.config.mts',
                    {
                      externalDependencies: ['vitest'],
                    },
                    {
                      env: 'CI',
                    },
                  ],
                  outputs: [`{workspaceRoot}/coverage/${libs}/${name}`],
                },
              },
            },
          },
        },
      ];
    });
  },
];
