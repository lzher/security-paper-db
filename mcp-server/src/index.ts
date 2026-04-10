#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { papers } from './data.js';
import { SearchPapersInputSchema, handleSearchPapers, handleListConferences } from './tools.js';

const server = new McpServer({
  name: 'security-paper-db',
  version: '1.0.0',
});

server.tool(
  'search_papers',
  'Search security and software engineering research papers. ' +
    'Supports regex or substring filtering on title/abstract and author, ' +
    'minimum year filter, and conference selection. ' +
    'All filters are combined with AND logic. ' +
    'Returns paginated results sorted by year descending.',
  SearchPapersInputSchema.shape,
  async (args) => handleSearchPapers(args, papers),
);

server.tool(
  'list_conferences',
  'List all available conferences with paper counts and year ranges. ' +
    'Call this first to understand what data is available before searching.',
  {},
  async () => handleListConferences(papers),
);

const transport = new StdioServerTransport();
await server.connect(transport);
