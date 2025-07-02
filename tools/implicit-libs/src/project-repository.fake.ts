import { ProjectRepository, Project } from './project-repository';

export class FakeProjectRepository implements ProjectRepository {
  private _projects: Project[] = [];

  configure({ projects }: { projects: Project[] }) {
    this._projects = projects;
  }

  async getProjects(): Promise<Project[]> {
    return this._projects;
  }
}
