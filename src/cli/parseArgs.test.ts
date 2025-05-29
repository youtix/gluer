import { describe, it, expect, vi } from 'vitest';
import { parseArgs, CliOptions } from '../../src/cli/parseArgs';

describe('parseArgs', () => {
  it('should parse default output and no exclusions', () => {
    const argv = ['node', 'app.js', './src', './lib'];
    const opts: CliOptions = parseArgs(argv);

    expect(opts.inputPaths).toEqual(['./src', './lib']);
    expect(opts.output).toBe('merged_output.txt');
    expect(opts.excludeExts).toEqual([]);
    expect(opts.excludePaths).toEqual([]);
  });

  it('should parse custom output option', () => {
    const argv = ['node', 'app.js', 'folder', '--output', 'all.txt'];
    const opts = parseArgs(argv);

    expect(opts.inputPaths).toEqual(['folder']);
    expect(opts.output).toBe('all.txt');
  });

  it('should parse exclude extensions with leading dot', () => {
    const argv = ['node', 'app.js', 'folder', '--exclude', '.log', '--exclude', '.png'];
    const opts = parseArgs(argv);

    expect(opts.inputPaths).toEqual(['folder']);
    expect(opts.excludeExts).toEqual(['.log', '.png']);
  });

  it('should parse exclude extensions without leading dot', () => {
    const argv = ['node', 'app.js', 'folder', '--exclude', 'log', '--exclude', 'txt'];
    const opts = parseArgs(argv);

    expect(opts.excludeExts).toEqual(['.log', '.txt']);
  });

  it('should parse exclude paths correctly', () => {
    const argv = [
      'node',
      'app.js',
      'folder',
      '--exclude-path',
      'test/',
      '--exclude-path',
      'build.js',
    ];
    const opts = parseArgs(argv);

    expect(opts.excludePaths).toEqual(['test', 'build.js']);
  });

  it('should throw error when no input paths provided', () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      throw new Error('Process exited with code ' + code);
    }) as any);

    expect(() => parseArgs(['node', 'app.js'])).toThrow('Process exited with code');

    exitSpy.mockRestore();
  });
});
