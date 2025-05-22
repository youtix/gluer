import { promises as fs } from 'fs';
import * as path from 'path';

export async function writeMergedOutput(files: string[], outputPath: string): Promise<void> {
  const cwd = process.cwd();

  await fs.writeFile(outputPath, '');

  for (const file of files) {
    const rel = path.relative(cwd, file);
    const content = await fs.readFile(file, 'utf-8');

    await fs.appendFile(outputPath, `// ./${rel}\n`);
    await fs.appendFile(outputPath, content + '\n\n');
  }
}
