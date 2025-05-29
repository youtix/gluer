# Gluer 🧷

[![CI](https://github.com/youtix/gluer/actions/workflows/ci.yml/badge.svg)](https://github.com/youtix/gluer/actions/workflows/ci.yml)
![License](https://img.shields.io/badge/license-MIT-blue)
![Bun](https://img.shields.io/badge/bun-v1.0+-green)
![Coverage](https://img.shields.io/badge/coverage-77%25-yellow)

> A simple CLI tool built with Bun.js to recursively collect and merge files into a single output file with annotated headers.

## 🚀 Features

- Recursively walks through directories and gathers file contents.
- Merges them into a single output file with file path headers.
- Excludes files by extension or path.
- Written in **TypeScript**, powered by **Bun.js** and tested with **Vitest**.
- Includes coverage reports and Prettier formatting.

## 📦 Requirements

- [Bun](https://bun.sh) v1.0+
- Node.js not required (fully Bun-native)

## 📄 Usage

```bash
bun run src/gluer.ts [options] <paths...>
```

### Example

```bash
bun run src/gluer.ts ./src ./lib --output merged.txt --exclude .log .json --exclude-path dist
```

### Options

| Flag                 | Description                                            |
| -------------------- | ------------------------------------------------------ |
| `<paths...>`         | One or more file or directory paths to include         |
| `--output <name>`    | Name of the output file (default: `merged_output.txt`) |
| `--exclude <ext>`    | File extensions to exclude (e.g., `.log`, `.json`)     |
| `--exclude-path <p>` | Specific files or folders to exclude by path           |

## 🧪 Testing

Run unit tests with:

```bash
bun run test
```

Or with coverage:

```bash
bun run test:coverage
```

Coverage reports are available in `coverage/`.

## 🧹 Formatting

To format the project with Prettier:

```bash
bun run format
```

To check formatting without modifying files:

```bash
bun run format:check
```

## 🧾 Type Checking

To verify TypeScript types without emitting files:

```bash
bun run type:check
```

## 🔨 Build

To compile a standalone binary:

```bash
bun run build
```

### Releasing

```bash
# detect version from commits
bun run release

# or force a specific bump
bun run release:patch | release:minor | release:major
```

## 📁 Project Structure

```
.
├── src/
│   ├── cli/              # CLI argument parsing
│   ├── core/             # Core logic (file collection, merging)
│   └── utils/            # Utility functions
├── dist/                 # Compiled output (ignored)
├── bun.lock              # Bun lockfile
├── tsconfig.json         # TypeScript configuration
├── vitest.config.ts      # Vitest testing setup
└── .prettierrc           # Prettier formatting rules
```

## 📜 License

This project is licensed under the [MIT License](./LICENSE).

## ✨ Author

Made with ❤️ by [Youtix](https://github.com/youtix)
