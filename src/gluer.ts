#!/usr/bin/env bun

import { parseArgs } from './cli/parseArgs';
import { collectFiles } from './core/collectFiles';
import { writeMergedOutput } from './core/writeMergedOutput';
import * as path from 'path';

async function main(): Promise<void> {
  try {
    const { inputPaths, output, excludeExts, excludePaths } = parseArgs();
    const outputAbs = path.resolve(output);

    const files = await collectFiles(inputPaths, excludeExts, excludePaths, outputAbs);

    await writeMergedOutput(files, outputAbs);
    console.log(`✅ ${files.length} file(s) merged in ${output}`);
  } catch (err) {
    console.error('❌ Error:', (err as Error).message);
    process.exitCode = 1;
  }
}

await main();
