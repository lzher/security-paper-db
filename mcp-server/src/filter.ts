import type { NormalizedPaper } from './data.js';

export interface FilterParams {
  title_abstract_regex?: string;
  author_regex?: string;
  min_year?: number;
  publications?: string[];
}

function buildTitleMatcher(input: string | undefined): (p: NormalizedPaper) => boolean {
  if (!input?.trim()) return () => true;
  const trimmed = input.trim();
  try {
    const re = new RegExp(trimmed, 'i');
    // Match title OR abstract separately (mirrors index.html buildTitleMatcher)
    return (p) => re.test(p.title) || re.test(p.abstract);
  } catch {
    // Invalid regex: fall back to case-insensitive substring on pre-lowercased field
    const plain = trimmed.toLowerCase();
    return (p) => p._titleAbstractLower.includes(plain);
  }
}

function buildAuthorMatcher(input: string | undefined): (p: NormalizedPaper) => boolean {
  if (!input?.trim()) return () => true;
  const trimmed = input.trim();
  try {
    const re = new RegExp(trimmed, 'i');
    return (p) => re.test(p.author);
  } catch {
    const plain = trimmed.toLowerCase();
    return (p) => p._authorLower.includes(plain);
  }
}

export function filterPapers(
  papers: NormalizedPaper[],
  params: FilterParams,
): NormalizedPaper[] {
  const titleMatcher = buildTitleMatcher(params.title_abstract_regex);
  const authorMatcher = buildAuthorMatcher(params.author_regex);
  const minYear = params.min_year ?? null;
  const pubSet =
    params.publications && params.publications.length > 0
      ? new Set(params.publications)
      : null;

  return papers.filter((p) => {
    if (!titleMatcher(p)) return false;
    if (!authorMatcher(p)) return false;
    if (minYear !== null && p._yearNumber < minYear) return false;
    if (pubSet !== null && !pubSet.has(p.publication)) return false;
    return true;
  });
}
