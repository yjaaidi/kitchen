import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Mastra } from '@mastra/core';
import { InMemoryStore, MastraCompositeStore } from '@mastra/core/storage';
import { LibSQLStore } from '@mastra/libsql';
import { FileTransport } from '@mastra/loggers/file';
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

// File transport keeps a durable local log; Studio's /logs page reads
// observability storage instead (see logging config below).
const mastraDir = join(process.cwd(), '.mastra');
const mastraLogPath = join(mastraDir, 'whiskmate-mastra.log');
if (!existsSync(mastraDir)) {
  mkdirSync(mastraDir, { recursive: true });
}
if (!existsSync(mastraLogPath)) {
  writeFileSync(mastraLogPath, '');
}

export const mastra = new Mastra({
  agents: {
    // Key must stay `default` — the Angular client selects this agent id.
    [cookingAgent.id]: cookingAgent,
  },
  storage,
  logger: new PinoLogger({
    name: 'whiskmate-mastra',
    level: 'info',
    transports: {
      file: new FileTransport({ path: mastraLogPath }),
    },
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'whiskmate',
        exporters: [
          new MastraStorageExporter({
            // Studio polls quickly; don't wait the default 5s batch window.
            maxBatchWaitMs: 500,
          }),
        ],
        // Studio /logs reads observability storage (not FileTransport). Default
        // min level is `warn`, which hides info-level application logs.
        logging: {
          enabled: true,
          level: 'info',
        },
      },
    },
  }),
});
