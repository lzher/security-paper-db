# Security Paper Database

A searchable database of security and software engineering research papers from CCS, IEEE S&P, NDSS, USENIX Security, ICSE, FSE, and ASE (2020–2026).

## Web UI

Visit https://lzher.github.io/security-paper-db/ to search papers in the browser.

Feel free to add and modify papers in the `/json` directory.

## MCP Server

An [MCP](https://modelcontextprotocol.io) server is available under `mcp-server/`, allowing AI clients (Claude Desktop, Claude Code, etc.) to search papers programmatically.

### Setup

```bash
cd mcp-server
npm install
npm run build
```

### Tools

| Tool | Description |
|------|-------------|
| `list_conferences` | List available conferences with paper counts and year ranges |
| `search_papers` | Search papers with regex filtering on title/abstract/author, min year, and conference selection |

`search_papers` parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `title_abstract_regex` | string | Regex or substring matched against title and abstract (OR), case-insensitive |
| `author_regex` | string | Regex or substring matched against author field, case-insensitive |
| `min_year` | integer | Inclusive minimum year (e.g. `2023`) |
| `publications` | string[] | Conferences to include: `ccs`, `sp`, `ndss`, `security`, `icse`, `fse`, `ase` |
| `limit` | integer | Max results to return (1–200, default 20) |
| `offset` | integer | Pagination offset (default 0) |

### Claude Code / Claude Desktop Configuration

Add to your MCP settings:

```json
{
  "mcpServers": {
    "security-paper-db": {
      "command": "node",
      "args": ["/path/to/security-paper-db/mcp-server/dist/index.js"]
    }
  }
}
```