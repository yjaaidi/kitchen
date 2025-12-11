import { execSync } from 'node:child_process';
import inquirer from 'enquirer';
import { readdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
const { prompt } = inquirer;

export class CommandRunner {
  executeCommand(
    command: string,
    { env }: { env?: Record<string, string> } = {}
  ): void {
    /* Ignore stdout. */
    execSync(command, {
      stdio: ['inherit', 'pipe', 'inherit'],
      env: {
        ...process.env,
        ...env,
      },
    });
  }
}

export class FileSystemAdapter {
  readFile(path: string): string {
    return readFileSync(path, {
      encoding: 'utf-8',
    });
  }

  writeFile(path: string, content: string): void {
    writeFileSync(path, content, {
      encoding: 'utf-8',
    });
  }

  readDir(path: string): string[] {
    return readdirSync(path);
  }

  removeDir(path: string): void {
    rmSync(path, { recursive: true });
  }
}

export class GitAdapter {
  getCurrentBranch() {
    return execSync('git branch --show-current', {
      encoding: 'utf8',
    }).trim();
  }

  hasLocalChanges() {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim().length > 0;
  }
}

export class PromptAdapter {
  private _interactive = true;

  disableInteractivity() {
    this._interactive = false;
  }

  /**
   * @returns The result of the prompt, or null if the prompt was not interactive and no initial value was provided.
   */
  async prompt<T>(
    options: PromptOptions<T> & { initial: T[keyof T] }
  ): Promise<T>;
  async prompt<T>(options: PromptOptions<T>): Promise<T | null>;
  async prompt<T>(options: PromptOptions<T>): Promise<T | null> {
    const { name, initial } = options;

    if (!this._interactive) {
      if (initial === undefined) {
        throw new Error(
          'Initial value is required when interactivity is disabled'
        );
      }

      return initial !== undefined
        ? ({
            [name as keyof T]: initial,
          } as T)
        : null;
    }

    return await prompt(options);
  }
}

type PromptOptions<T> = Exclude<
  Parameters<typeof prompt<T>>[0],
  ((...args: unknown[]) => unknown) | unknown[]
>;
