import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { PlatformStoreState } from "./store.js";

export interface JsonPlatformRepository {
  load(): Promise<PlatformStoreState>;
  save(state: PlatformStoreState): Promise<void>;
}

export const createEmptyPlatformState = (): PlatformStoreState => ({
  agents: [],
  instances: [],
  conversations: [],
  messages: [],
  warmingProfiles: [],
  warmingSessions: [],
  warmingMessageLogs: [],
  instanceBlockEvents: [],
  webhookSubscriptions: [],
  webhookDeliveries: [],
  metrics: []
});

export function createJsonPlatformRepository(filePath: string): JsonPlatformRepository {
  return {
    async load() {
      try {
        await access(filePath);
      } catch {
        return createEmptyPlatformState();
      }

      const raw = await readFile(filePath, { encoding: "utf8" });
      const parsed = JSON.parse(raw) as Partial<PlatformStoreState>;

      return {
        ...createEmptyPlatformState(),
        ...parsed
      };
    },
    async save(state) {
      await mkdir(dirname(filePath), { recursive: true });
      await writeFile(filePath, `${JSON.stringify(state, null, 2)}\n`, { encoding: "utf8" });
    }
  };
}

