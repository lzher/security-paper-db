import { z } from 'zod';
import type { NormalizedPaper, Paper } from './data.js';
import { filterPapers } from './filter.js';

export const KNOWN_CONFERENCES = ['ccs', 'sp', 'ndss', 'icse', 'fse', 'ase', 'security'] as const;
export type ConferenceCode = typeof KNOWN_CONFERENCES[number];

const CONFERENCE_NAMES: Record<string, string> = {
  ccs: 'ACM CCS (Conference on Computer and Communications Security)',
  sp: 'IEEE S&P (Symposium on Security and Privacy)',
  ndss: 'NDSS (Network and Distributed System Security Symposium)',
  icse: 'ICSE (International Conference on Software Engineering)',
  fse: 'FSE / ESEC (Foundations of Software Engineering)',
  ase: 'ASE (Automated Software Engineering)',
  security: 'USENIX Security Symposium',
};

export const SearchPapersInputSchema = z.object({
  title_abstract_regex: z
    .string()
    .optional()
    .describe(
      'Regex (or plain substring) matched case-insensitively against paper title and abstract ' +
      '(OR logic: matches if either field matches). Falls back to substring match on invalid regex. ' +
      'Note: some author/title fields contain LaTeX encoding (e.g. M\\\\"{u}ller for Müller); ' +
      'use partial patterns like "ller" or "M.*ller" to match such names.',
    ),
  author_regex: z
    .string()
    .optional()
    .describe(
      'Regex (or plain substring) matched case-insensitively against the author field. ' +
      'Falls back to substring match on invalid regex. ' +
      'USENIX Security entries use format "Authors:Name,Affiliation;Name,Affiliation".',
    ),
  min_year: z
    .number()
    .int()
    .min(2000)
    .max(2100)
    .optional()
    .describe('Inclusive minimum publication year. Papers with year < min_year are excluded.'),
  publications: z
    .array(z.enum(KNOWN_CONFERENCES))
    .optional()
    .describe(
      'Conferences to include. Omit or pass empty array for all conferences. ' +
      'Valid values: ccs, sp, ndss, icse, fse, ase, security (USENIX Security).',
    ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(200)
    .default(20)
    .describe('Maximum number of results to return (1–200, default 20).'),
  offset: z
    .number()
    .int()
    .min(0)
    .default(0)
    .describe('Zero-based offset for pagination (default 0).'),
});

export type SearchPapersInput = z.infer<typeof SearchPapersInputSchema>;

function paperToResult(p: NormalizedPaper): Paper {
  return {
    title: p.title,
    author: p.author,
    abstract: p.abstract,
    year: p.year,
    publication: p.publication,
    link: p.link,
    comment: p.comment,
  };
}

export function handleSearchPapers(
  args: unknown,
  allPapers: NormalizedPaper[],
): { content: Array<{ type: 'text'; text: string }> } {
  const parsed = SearchPapersInputSchema.parse(args);
  const { title_abstract_regex, author_regex, min_year, publications, limit, offset } = parsed;

  const matched = filterPapers(allPapers, {
    title_abstract_regex,
    author_regex,
    min_year,
    publications: publications as string[] | undefined,
  });

  // Sort by year descending (matches index.html default sort)
  matched.sort((a, b) => b._yearNumber - a._yearNumber);

  const page = matched.slice(offset, offset + limit);
  const result = {
    total_matched: matched.length,
    returned: page.length,
    offset,
    limit,
    papers: page.map(paperToResult),
  };

  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
}

export function handleListConferences(
  allPapers: NormalizedPaper[],
): { content: Array<{ type: 'text'; text: string }> } {
  const stats: Record<string, { count: number; minYear: number; maxYear: number }> = {};

  for (const p of allPapers) {
    const code = p.publication;
    if (!stats[code]) {
      stats[code] = { count: 0, minYear: Infinity, maxYear: -Infinity };
    }
    stats[code].count++;
    if (p._yearNumber > 0) {
      if (p._yearNumber < stats[code].minYear) stats[code].minYear = p._yearNumber;
      if (p._yearNumber > stats[code].maxYear) stats[code].maxYear = p._yearNumber;
    }
  }

  const conferences = Object.entries(stats).map(([code, s]) => ({
    code,
    full_name: CONFERENCE_NAMES[code] ?? code,
    paper_count: s.count,
    year_range: {
      min: s.minYear === Infinity ? 0 : s.minYear,
      max: s.maxYear === -Infinity ? 0 : s.maxYear,
    },
  }));

  // Sort by conference code for consistent output
  conferences.sort((a, b) => a.code.localeCompare(b.code));

  return { content: [{ type: 'text', text: JSON.stringify(conferences, null, 2) }] };
}
