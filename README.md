# Charted Coding

[![Charted Coding Demo](./charted-coding-video-thumbnail.webp)](https://youtu.be/8z9tUsSoros)

[📺 Watch the video on YouTube](https://youtu.be/8z9tUsSoros) 

[✅ Learn more about Angular Testing](https://marmico.de/test.ng)

## Getting Started

### 1. Install dependencies

This will also build the Charted Coding MCP server.

```sh
pnpm install
```

## 2. Enable the MCP server

You should see a dialog in Cursor asking you to enable the MCP server.

Otherwise, go to the MCP Settings (`Ctrl or Cmd + Shift + P` > "MCP Settings", or go to `Cursor Settings` > `Tools & Integrations`) and enable the Charted Coding MCP server.

## 3. Write a design doc

Cf. [Recipe Pagination Design Doc](./design-docs/recipe-pagination.md)

## 4. Prompt in Cursor chat

Reference the design doc in the prompt and ask the Charted Coding step of your choice:

- **`scaffold`**: Generate empty files.
- **`wip`**: Generate work in progress code and tests.
- **`next test`**: Implement the next failing test in the selected test file.
- **`green`**: Implement whatever is needed to make the tests in the selected test file pass.

## Charted Coding MCP server

The source code of the Charted Coding MCP server is at [tools/mcp-charted-coding/src/main.ts](./tools/mcp-charted-coding/src/main.ts).

If you want to create your own MCP server, Nx can get you started even faster. Cf. [Building an MCP Server with Nx
](https://nx.dev/blog/building-mcp-server-with-nx) by [Max Kless](https://x.com/MaxKless).

## Customizing the MCP server

If you want to have fun and edit the MCP server:
- edit the source code in [tools/mcp-charted-coding/src/main.ts](./tools/mcp-charted-coding/src/main.ts)
- build it with `pnpm nx build mcp-charted-coding`
- ⚠️ due to some caching issues probably, you will have to either restart Cursor or rename the MCP server in `mcp.json`.

## License

MIT
