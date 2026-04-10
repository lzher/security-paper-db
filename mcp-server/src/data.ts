import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

export interface Paper {
  title: string;
  author: string;
  abstract: string;
  year: string;
  publication: string;
  link: string;
  comment: string;
}

export interface NormalizedPaper extends Paper {
  _yearNumber: number;
  _titleAbstractLower: string;
  _authorLower: string;
}

interface Config {
  json_files: string[];
}

// Resolve repo root from dist/data.js location: dist → mcp-server → repo root
const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');

function normalizeItem(p: Paper): NormalizedPaper {
  return {
    ...p,
    _yearNumber: parseInt(p.year, 10) || 0,
    _titleAbstractLower: (p.title + ' ' + p.abstract).toLowerCase(),
    _authorLower: p.author.toLowerCase(),
  };
}

function loadPapers(): NormalizedPaper[] {
  const configPath = resolve(REPO_ROOT, 'config.json');
  const config: Config = JSON.parse(readFileSync(configPath, 'utf-8'));

  const all: NormalizedPaper[] = [];
  for (const relPath of config.json_files) {
    const absPath = resolve(REPO_ROOT, relPath);
    try {
      const papers: Paper[] = JSON.parse(readFileSync(absPath, 'utf-8'));
      for (const p of papers) {
        all.push(normalizeItem(p));
      }
    } catch (err) {
      // Skip files that fail to load rather than crashing the whole server
      process.stderr.write(`Warning: failed to load ${absPath}: ${err}\n`);
    }
  }
  return all;
}

// Load synchronously at module init — all ~9500 papers fit comfortably in memory
export const papers: NormalizedPaper[] = loadPapers();
