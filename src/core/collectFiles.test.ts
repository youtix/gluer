// tests/core/collectFiles.test.ts
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { collectFiles } from '../../src/core/collectFiles';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';

const tempDir = path.join(os.tmpdir(), 'collectFilesTest');
let originalCwd: string;

async function setupStructure() {
  await fs.mkdir(path.join(tempDir, 'dirA', 'sub'), { recursive: true });
  await fs.mkdir(path.join(tempDir, 'excludeMe'), { recursive: true });
  await fs.writeFile(path.join(tempDir, 'dirA', 'a1.ts'), 'a1 content');
  await fs.writeFile(path.join(tempDir, 'dirA', 'a2.log'), 'a2 content');
  await fs.writeFile(path.join(tempDir, 'dirA', 'sub', 'subfile.ts'), 'subfile content');
  await fs.writeFile(path.join(tempDir, 'root.txt'), 'root content');
  await fs.writeFile(path.join(tempDir, 'output.txt'), 'output content');
  await fs.writeFile(path.join(tempDir, 'excludeMe', 'skip.ts'), 'should be excluded');
}

async function cleanup() {
  async function rmDir(p: string) {
    try {
      const entries = await fs.readdir(p);
      await Promise.all(
        entries.map(async (e) => {
          const full = path.join(p, e);
          const stat = await fs.stat(full);
          if (stat.isDirectory()) await rmDir(full);
          else await fs.unlink(full);
        }),
      );
      await fs.rmdir(p);
    } catch {}
  }
  await rmDir(tempDir);
}

describe('collectFiles', () => {
  beforeEach(async () => {
    await cleanup();
    await fs.mkdir(tempDir, { recursive: true });
    await setupStructure();
    originalCwd = process.cwd();
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await cleanup();
  });

  it('collects all files when no exclusions and no output filter', async () => {
    const paths = [tempDir];
    const result = await collectFiles(paths, []);
    const sorted = result.map((p) => path.relative(tempDir, p)).sort();
    expect(sorted).toEqual(
      [
        path.join('dirA', 'a1.ts'),
        path.join('dirA', 'a2.log'),
        path.join('dirA', 'sub', 'subfile.ts'),
        'output.txt',
        'root.txt',
        path.join('excludeMe', 'skip.ts'),
      ].sort(),
    );
  });

  it('excludes files by extension', async () => {
    const paths = [tempDir];
    const result = await collectFiles(paths, ['.log', '.txt']);
    const sorted = result.map((p) => path.relative(tempDir, p)).sort();
    expect(sorted).toEqual(
      [
        path.join('dirA', 'a1.ts'),
        path.join('dirA', 'sub', 'subfile.ts'),
        path.join('excludeMe', 'skip.ts'),
      ].sort(),
    );
  });

  it('excludes the output file when outputAbs is provided', async () => {
    const outputPath = path.resolve(tempDir, 'output.txt');
    const paths = [tempDir];
    const result = await collectFiles(paths, [], [], outputPath);
    const rels = result.map((p) => path.relative(tempDir, p));
    expect(rels).not.toContain('output.txt');
  });

  it('collects single file path input', async () => {
    const filePath = path.resolve(tempDir, 'root.txt');
    const result = await collectFiles([filePath], []);
    expect(result).toEqual([filePath]);
  });

  it('excludes paths explicitly provided in excludePaths', async () => {
    const excludePath = path.resolve(tempDir, 'excludeMe');
    const paths = [tempDir];
    const result = await collectFiles(paths, [], [excludePath]);
    const rels = result.map((p) => path.relative(tempDir, p));
    expect(rels).not.toContain(path.join('excludeMe', 'skip.ts'));
  });
});
