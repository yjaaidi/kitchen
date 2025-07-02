import { CreateNodesV2 } from '@nx/devkit';
import { parsePath, PATH_PATTERN } from './strategy';

export const createNodesV2: CreateNodesV2 = [
  PATH_PATTERN,
  (indexPathList: string[]) => {
    return indexPathList.map((indexPath) => {
      const { projectRoot, projectName, scope, type } = parsePath(indexPath);

      return [
        indexPath,
        {
          projects: {
            [projectRoot]: {
              name: projectName,
              sourceRoot: projectRoot,
              tags: [`scope:${scope}`, `type:${type}`],
            },
          },
        },
      ];
    });
  },
];
