export const PROJECTS_ROOT = 'src';
export const PATH_PATTERN = `${PROJECTS_ROOT}/*/*/index.ts`;

export function parsePath(path: string) {
  const [libs, scope, name] = path.split('/');
  const projectRoot = `${libs}/${scope}/${name}`;
  const projectName = `${scope}-${name}`;
  const nameParts = name.split('-');
  const type = nameParts[0];
  return {
    projectRoot,
    projectName,
    name,
    scope,
    type,
  };
}
