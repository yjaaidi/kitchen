#!/usr/bin/env node

import { $ } from 'zx';
import { config } from './cook/config.ts';
import { dirname, join } from 'path/posix';
import { fileURLToPath } from 'url';

const { exercises } = config;

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLONE_CHANGES_CMD = join(__dirname, 'clone-changes.sh');

async function main(args: string[]) {
  const [startProject = computeExerciseProjects(exercises[0].id).starter] =
    args;

  const exerciceIds = exercises.map((exercise) => exercise.id);

  const projects = exerciceIds
    .map((exerciseId) => {
      const { starter, solution } = computeExerciseProjects(exerciseId);
      return [starter, solution];
    })
    .flat();

  const startIndex = projects.indexOf(startProject);
  if (startIndex === -1) {
    console.error(`Project ${startProject} not found`);
    process.exit(1);
  }

  const filteredProjects = projects.slice(startIndex);
  const pairwisedProjects = pairwise(filteredProjects);

  for (const [source, destination] of pairwisedProjects) {
    await $`${CLONE_CHANGES_CMD} ${source} ${destination}`;
  }
}

function computeExerciseProjects(exerciseId: string) {
  return {
    starter: `${exerciseId}-starter`,
    solution: `${exerciseId}-solution`,
  };
}

function pairwise<T>(list: Array<T>): Array<[T, T]> {
  return list.reduce(
    (acc, project, index) => {
      if (index > 0) {
        acc.push([list[index - 1], project]);
      }
      return acc;
    },
    [] as [T, T][],
  );
}

main(process.argv.slice(2));
