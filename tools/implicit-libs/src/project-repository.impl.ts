import { createProjectGraphAsync } from '@nx/devkit';
import { ProjectRepository, Project } from './project-repository';

export class ProjectRepositoryImpl implements ProjectRepository {
  async getProjects(): Promise<Project[]> {
    const projectGraph = await createProjectGraphAsync();
    return Object.entries(projectGraph.nodes).map(([name, node]) => ({
      name,
      root: node.data.root,
    }));
  }
}
