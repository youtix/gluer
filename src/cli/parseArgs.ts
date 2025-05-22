import { Command } from 'commander';

export interface CliOptions {
  inputPaths: string[];
  output: string;
  excludeExts: string[];
  excludePaths: string[];
}

export function parseArgs(argv: string[] = process.argv): CliOptions {
  const program = new Command();

  program
    .name('gluer')
    .usage('[options] <paths...>')
    .description('Recursively reads files from folders, merging content into a single file.')
    .argument('<paths...>', 'Paths to folders or files')
    .option('--output <name>', 'Output file name', 'merged_output.txt')
    .option(
      '--exclude <ext...>',
      'File extensions to exclude (e.g., .png .log)',
      (value, previous: string[]) => previous.concat(value),
      [],
    )
    .option(
      '--exclude-path <path...>',
      'Paths to exclude (files or folders)',
      (value, previous: string[]) => previous.concat(value),
      [],
    )
    .parse(argv);

  const opts = program.opts<{ output: string; exclude: string[]; excludePath: string[] }>();
  const inputPaths = program.args as string[];

  if (inputPaths.length === 0) {
    program.help({ error: true });
  }

  const excludeExts = (opts.exclude || []).map((ext) => (ext.startsWith('.') ? ext : `.${ext}`));

  return {
    inputPaths,
    output: opts.output,
    excludeExts,
    excludePaths: opts.excludePath.map((p) => p.replace(/\/$/, '')),
  };
}
