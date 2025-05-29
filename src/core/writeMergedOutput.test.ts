import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { writeMergedOutput } from './writeMergedOutput';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';

const tempDir = path.join(os.tmpdir(), 'writeMergedOutputTest');
let originalCwd: string;
const file1Name = 'file1.ts';
const file2Name = 'file2.txt';
const outputName = 'merged.txt';

async function setupFiles() {
  await fs.writeFile(path.join(tempDir, file1Name), 'console.log("file1");', 'utf-8');
  await fs.writeFile(path.join(tempDir, file2Name), 'content of file2', 'utf-8');
}

async function cleanupDir() {
  try {
    const files = await fs.readdir(tempDir);
    await Promise.all(files.map((f) => fs.unlink(path.join(tempDir, f))));
    await fs.rmdir(tempDir);
  } catch {
    // ignore if not exists
  }
}

describe('writeMergedOutput', () => {
  beforeEach(async () => {
    // Prepare temporary directory and change cwd
    await cleanupDir();
    await fs.mkdir(tempDir);
    await setupFiles();
    originalCwd = process.cwd();
    process.chdir(tempDir);
  });

  afterEach(async () => {
    // Restore cwd and clean up
    process.chdir(originalCwd);
    await cleanupDir();
  });

  it('should write merged output with headers and contents', async () => {
    const filePaths = [path.join(tempDir, file1Name), path.join(tempDir, file2Name)];
    const outputPath = path.join(tempDir, outputName);

    await writeMergedOutput(filePaths, outputPath);

    const result = await fs.readFile(outputPath, 'utf-8');
    const expected =
      `// ./${file1Name}\n` +
      `console.log("file1");\n\n` +
      `// ./${file2Name}\n` +
      `content of file2\n\n`;

    expect(result).toBe(expected);
  });

  it('should overwrite existing output file', async () => {
    const outputPath = path.join(tempDir, outputName);
    // Pre-populate with dummy content
    await fs.writeFile(outputPath, 'dummy', 'utf-8');

    const filePaths = [path.join(tempDir, file1Name)];
    await writeMergedOutput(filePaths, outputPath);
    const result = await fs.readFile(outputPath, 'utf-8');

    expect(result.startsWith('// ./')).toBe(true);
    expect(result.includes('dummy')).toBe(false);
  });
});
