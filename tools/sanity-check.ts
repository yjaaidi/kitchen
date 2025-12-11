import { workspaceRoot } from '@nx/devkit';
import { readdirSync } from 'node:fs';
import { join } from 'node:path/posix';
import { config } from './cook/config.ts';

function main() {
  const projects = readdirSync(join(workspaceRoot, 'apps'));
  const expectedProjects = config.exercises
    .map((exercise) => [`${exercise.id}-starter`, `${exercise.id}-solution`])
    .flat();

  const missingProjects = expectedProjects.filter(
    (project) => !projects.includes(project),
  );
  const extraProjects = projects.filter(
    (project) => !expectedProjects.includes(project),
  );

  if (!missingProjects.length && !extraProjects.length) {
    console.log('✅All projects are as expected.');
  } else {
    if (missingProjects.length) {
      console.log('❌ Missing projects:');
      printProjects(missingProjects);
    }

    if (extraProjects.length) {
      console.log('🚧 Extra projects:');
      printProjects(extraProjects);
    }

    process.exit(1);
  }
}

function printProjects(projects: string[]) {
  for (const project of projects) {
    console.log(`- ${project}`);
  }
}

main();
