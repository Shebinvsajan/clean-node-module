# clean-node-module

> **Recursively manage `node_modules` folders**

**Installation**

```bash
# Install globally via npm:
npm install -g clean-node-module
# Or use npx without install:
npx clean-node-module <action> [path]
```

---

## Commands & Options

All commands accept an optional `[path]` argument. If omitted, the script runs against the current working directory.

| Action   | Description                                                             |
| -------- | ----------------------------------------------------------------------- |
| `size`   | Display the total size of each `node_modules` found                     |
| `count`  | Show the number of `node_modules` folders plus subfolders each contains |
| `delete` | Recursively delete all `node_modules` folders (default)                 |

---

## Usage Examples

### 1. Display Sizes

```bash
clean-node-module size ./my-project
```

Outputs the size of each `node_modules` directory under `./my-project`, in MB.

### 2. Count Folders

```bash
clean-node-module count /path/to/repo
```

Lists how many `node_modules` folders exist and how many subdirectories each has.

### 3. Delete All `node_modules`

```bash
# Default action is delete
clean-node-module /path/to/monorepo

# Or explicitly:
clean-node-module delete .
```

Recursively purges every `node_modules` folder under the specified path.

---

## How It Works

* Uses Node.js `fs/promises.readdir` with `withFileTypes` to efficiently walk directories.
* Detects any folder named `node_modules` at any depth and gathers its path.
* Depending on the action, it either computes directory size (`fs.stat`), counts subdirectories, or removes the folder (`fs.rm`).
* Runs asynchronously, so it won’t block your terminal even in large projects.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Make your changes and commit: `git commit -m 'feat: add XYZ'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
