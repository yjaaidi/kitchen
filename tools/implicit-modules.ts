import { CreateNodesResult, CreateNodesV2 } from '@nx/devkit';
import { dirname, sep } from 'node:path/posix';

export const createNodesV2: CreateNodesV2 = [
  'packages/*/src/*/index.ts',
  async (indexFiles) => {
    return indexFiles.map((indexFile) => {
      const projectRoot = dirname(indexFile);
      const [__packages, packageName, __src, folderName] = indexFile.split(sep);
      const [type, ...rest] = folderName.split('-');
      const name = rest.join('-');
      let projectName = `${packageName}-${type}`;
      if (name) {
        projectName += `-${name}`;
      }

      return [
        indexFile,
        {
          projects: {
            [projectName]: {
              root: projectRoot,
              name: projectName,
              tags: [`package:${packageName}`, `type:${type}`, `name:${name}`],
            },
          },
        } satisfies CreateNodesResult,
      ];
    });
  },
];
