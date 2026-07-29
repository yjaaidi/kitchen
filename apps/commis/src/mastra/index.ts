import { Mastra } from '@mastra/core';
import { InMemoryStore, MastraCompositeStore } from '@mastra/core/storage';
import { LibSQLStore } from '@mastra/libsql';
import { PinoLogger } from '@mastra/loggers';
import { MastraStorageExporter, Observability } from '@mastra/observability';
import { cookingAgent } from './cooking-agent';

const libsql = new LibSQLStore({
  id: 'whiskmate-libsql',
  url: process.env.MASTRA_DB_URL ?? 'file:./.mastra/whiskmate.db',
});

// LibSQL observability only implements span tracing. Studio also polls
// feedback/logs/metrics APIs, which throws "does not support listing feedback".
const inMemoryStore = new InMemoryStore({
  id: 'whiskmate-in-memory',
});

const storage = new MastraCompositeStore({
  id: 'whiskmate-storage',
  default: libsql,
  domains: {
    observability: inMemoryStore.stores.observability,
  },
});

export const mastra = new Mastra({
  agents: {
    // Key must stay `default` — the Angular client selects this agent id.
    [cookingAgent.id]: cookingAgent,
  },
  storage,
  logger: new PinoLogger({
    name: 'whiskmate-mastra',
    level: 'info',
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'whiskmate',
        exporters: [new MastraStorageExporter()],
      },
    },
  }),
});
