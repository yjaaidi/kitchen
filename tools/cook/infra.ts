import inquirer from 'enquirer';
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { basename, join, relative } from 'node:path';

const { prompt } = inquirer;

const TRASH_PATH = join(process.cwd(), 'tmp', 'trash');
export class CommandRunner {
  executeCommand(
    command: string,
    { env }: { env?: Record<string, string> } = {},
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

  /**
   * Windows antiviruses can be a pain (e.g. EBUSY errors).
   * This method will try to remove the folder multiple times,
   * then if it fails, it will try to move the folder to tmp/trash,
   * and finally if that fails, it will warn the user that they may need to remove it manually.
   *
   * Note that I've tried to use rimraf and its backoff but that wasn't enough.
   */
  removeDir(path: string): void {
    try {
      rmSync(path, { maxRetries: 10, recursive: true });
    } catch {
      try {
        mkdirSync(TRASH_PATH, { recursive: true });
        const targetPath = join(TRASH_PATH, `${basename(path)}-${Date.now()}`);
        renameSync(path, targetPath);
      } catch (error: unknown) {
        const relativeTargetPath = relative(process.cwd(), path);
        const reason = error instanceof Error ? error.message : error;
        console.warn(
          `⚠️ Failed to remove ${relativeTargetPath}. You may need to remove it manually. Reason: ${reason}`,
        );
      }
    }
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
    options: PromptOptions<T> & { initial: T[keyof T] },
  ): Promise<T>;
  async prompt<T>(options: PromptOptions<T>): Promise<T | null>;
  async prompt<T>(options: PromptOptions<T>): Promise<T | null> {
    const { name, initial } = options;

    if (!this._interactive) {
      if (initial === undefined) {
        throw new Error(
          'Initial value is required when interactivity is disabled',
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
