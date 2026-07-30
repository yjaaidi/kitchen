import { MastraAgent } from '@ag-ui/mastra';
import { CopilotRuntime, InMemoryAgentRunner } from '@copilotkit/runtime/v2';
import { createCopilotNodeListener } from '@copilotkit/runtime/v2/node';
import { MastraServer } from '@mastra/express';
import cors from 'cors';
import express from 'express';
import { createServer } from 'node:http';
import { mastra } from './mastra';
import { RECIPE_A2UI_CATALOG } from './a2ui/recipe-catalog';

/** In-memory thread ownership keyed by thread id. */
const threadOwnerByThreadIdMap = new Map<string, string>();

const requestUserIdMap = new WeakMap<Request, string>();

const runtime = new CopilotRuntime({
  runner: new InMemoryAgentRunner(),
  forwardHeaders: {
    deny: ['authorization'],
    denyPrefixes: ['x-'],
  },
  // Server-owned A2UI catalog. Cooking agent owns generate_a2ui (structured
  // composition → a2ui_operations tool result). Keep middleware inject off so
  // render_a2ui is not advertised to the planner; middleware still paints from
  // TOOL_CALL_RESULT.
  a2ui: {
    agents: ['default'],
    schema: RECIPE_A2UI_CATALOG,
    defaultCatalogId: RECIPE_A2UI_CATALOG.catalogId,
    injectA2UITool: false,
  },
  agents: async ({ request }) => {
    const userId = requestUserIdMap.get(request);
    if (!userId) {
      throw unauthorizedResponse();
    }

    return {
      default: new MastraAgent({
        agentId: 'default',
        agent: mastra.getAgent('default'),
        resourceId: userId,
      }),
    };
  },
});

const port = Number(process.env.PORT ?? 4100);
const mastraPort = Number(process.env.MASTRA_PORT ?? 4111);

createServer(
  createCopilotNodeListener({
    runtime,
    basePath: '/api/copilotkit',
    cors: true,
    hooks: {
      onRequest: async ({ request }) => {
        requestUserIdMap.set(request, getUserIdFromAuthorization(request));
      },
      onBeforeHandler: async ({ request, route }) => {
        if (route.method === 'cpk-debug-events') {
          return;
        }

        const userId = requestUserIdMap.get(request);
        if (!userId) {
          throw unauthorizedResponse();
        }

        // Local InMemory thread endpoints are not user-scoped — deny them.
        if (route.method.startsWith('threads/')) {
          throw unauthorizedResponse();
        }

        if (route.method === 'info' || route.method === 'transcribe') {
          return;
        }

        // stop (and other path-param routes) expose threadId on the route.
        let threadId = 'threadId' in route ? route.threadId : undefined;

        // run / connect put threadId in the JSON body.
        if (request.method === 'POST') {
          try {
            threadId = (await request.clone().json())?.threadId;
          } catch {
            throw unauthorizedResponse();
          }
        }

        assertThreadOwnership(threadId, userId);
      },
    },
  }),
).listen(port, () => {
  console.log(
    `Copilot Runtime listening at http://localhost:${port}/api/copilotkit`,
  );
});

async function startMastraServer() {
  const app = express();
  app.use(express.json({ limit: '4mb' }));
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );

  const server = new MastraServer({ app, mastra });
  await server.init();

  app.listen(mastraPort, () => {
    console.log(
      `Mastra API listening at http://localhost:${mastraPort}/api (agents: /api/agents)`,
    );
    console.log(`Open Studio UI with: npx mastra studio -s ${mastraPort}`);
    mastra.getLogger().info('Mastra API listening', {
      port: mastraPort,
      agentsPath: '/api/agents',
    });
  });
}

startMastraServer().catch((error) => {
  console.error('Failed to start Mastra API', error);
  process.exit(1);
});

function getUserIdFromAuthorization(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const userId = authHeader.slice('Bearer '.length).trim();
  return userId.length > 0 ? userId : null;
}

function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: 'unauthorized' }), {
    status: 401,
    headers: { 'content-type': 'application/json' },
  });
}

function assertThreadOwnership(threadId: string | undefined, userId: string) {
  if (!threadId) {
    console.error('Thread ID is required', { userId });
    throw unauthorizedResponse();
  }

  const ownerId = threadOwnerByThreadIdMap.get(threadId);
  if (ownerId && ownerId !== userId) {
    console.error('Unauthorized request', { userId, threadId });
    throw unauthorizedResponse();
  }

  threadOwnerByThreadIdMap.set(threadId, userId);
}
