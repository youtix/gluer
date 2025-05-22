import { promises as fs } from 'fs';
import * as path from 'path';
import { isExcluded } from '../utils/isExcluded';

export async function collectFiles(
  paths: string[],
  excludeExts: string[],
  excludePaths: string[] = [],
  outputAbs?: string,
): Promise<string[]> {
  const results: string[] = [];
  const cwd = process.cwd();

  function isPathExcluded(p: string): boolean {
    return excludePaths.some((excl) => p.includes(path.resolve(cwd, excl)));
  }

  async function walk(p: string): Promise<void> {
    const stat = await fs.stat(p);
    const absPath = path.resolve(p);

    if (outputAbs && absPath === outputAbs) return;
    if (isPathExcluded(absPath)) return;

    if (stat.isDirectory()) {
      const entries = await fs.readdir(p);
      await Promise.all(entries.map((entry) => walk(path.join(p, entry))));
    } else if (stat.isFile()) {
      if (!isExcluded(p, excludeExts)) results.push(absPath);
    }
  }

  await Promise.all(paths.map(walk));
  return results;
}
