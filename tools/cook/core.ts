export interface Config {
  base: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;

  /**
   * This option forces TDD mode.
   * It is necessary for exercises where we want users to migrate something,
   * and see which tests survive the migration.
   */
  forceTdd?: boolean;
  implementationFiles?: string[];
}
