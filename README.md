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