#!/usr/bin/env node
/**
 * clean-node-modules.js
 * Recursively operate on all node_modules folders under a given directory.
 *
 * Usage:
 *   chmod +x clean-node-modules.js
 *   ./clean-node-modules.js <action> [path]
 *
 * Actions:
 *   size   - Display total size of each node_modules folder
 *   count  - Display how many node_modules folders and how many subfolders each contains
 *   delete - Delete all node_modules folders (default if no action provided)
 *
 * If [path] is omitted, defaults to current directory.
 */

import { readdir, stat, rm } from 'fs/promises';
import { join } from 'path';

async function findNodeModules(dir, results = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') {
        results.push(fullPath);
      } else {
        await findNodeModules(fullPath, results);
      }
    }
  }
  return results;
}

async function getDirSize(dir) {
  let total = 0;
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return 0;
  }
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      total += await getDirSize(fullPath);
    } else {
      try {
        const stats = await stat(fullPath);
        total += stats.size;
      } catch {}
    }
  }
  return total;
}

async function runSize(paths) {
  for (const p of paths) {
    const size = await getDirSize(p);
    console.log(`📦 ${p}: ${ (size/1024/1024).toFixed(2) } MB`);
  }
}

async function runCount(paths) {
  console.log(`🔍 Found ${paths.length} node_modules folder${paths.length !== 1 ? 's' : ''}`);
  for (const p of paths) {
    let entries;
    try {
      entries = await readdir(p, { withFileTypes: true });
    } catch {
      entries = [];
    }
    const dirs = entries.filter(e => e.isDirectory()).length;
    console.log(`📂 ${p}: contains ${dirs} subfolder${dirs !== 1 ? 's' : ''}`);
  }
}

async function runDelete(paths) {
  for (const p of paths) {
    try {
      await rm(p, { recursive: true, force: true });
      console.log(`🗑️ Deleted: ${p}`);
    } catch (err) {
      console.error(`❌ Failed to delete ${p}: ${err.message}`);
    }
  }
  console.log(`✅ Done deleting ${paths.length} node_modules folder${paths.length !== 1 ? 's' : ''}.`);
}

async function main() {
  const action = process.argv[2] || 'delete';
  const target = process.argv[3] || '.';
  const nodeModulesPaths = await findNodeModules(target);

  switch (action) {
    case 'size':
      await runSize(nodeModulesPaths);
      break;
    case 'count':
      await runCount(nodeModulesPaths);
      break;
    case 'delete':
      await runDelete(nodeModulesPaths);
      break;
    default:
      console.error(`Unknown action: ${action}`);
      console.error('Valid actions are: size, count, delete');
      process.exit(1);
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});

