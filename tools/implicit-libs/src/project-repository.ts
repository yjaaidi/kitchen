export interface ProjectRepository {
  getProjects(): Promise<Project[]>;
}

export interface Project {
  name: string;
  root: string;
}
