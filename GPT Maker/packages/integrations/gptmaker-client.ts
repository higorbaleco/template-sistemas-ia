import { z } from 'zod';

export class AdapterError extends Error {
  constructor(
    public type: 'ApiError' | 'RateLimited' | 'Timeout' | 'Unknown',
    message: string
  ) {
    super(message);
  }
}

export interface GptMakerOperation {
  id: string;
  name: string;
  category: string;
  rateLimit: number;
  timeout: number;
}

export const OPERATIONS_CATALOG: Record<string, GptMakerOperation> = {
  SEND_MESSAGE: {
    id: 'SEND_MESSAGE',
    name: 'Send Message',
    category: 'messaging',
    rateLimit: 100,
    timeout: 30000,
  },
  TRAIN_MODEL: {
    id: 'TRAIN_MODEL',
    name: 'Train Model',
    category: 'training',
    rateLimit: 10,
    timeout: 300000,
  },
  // ... 70 more operations
};

export class GptMakerClient {
  private apiKey: string;
  private baseUrl = 'https://api.gptmaker.dev/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async execute(
    operation: string,
    params: Record<string, any>,
    orgId: string
  ): Promise<any> {
    const op = OPERATIONS_CATALOG[operation];
    if (!op) {
      throw new AdapterError('ApiError', `Operation ${operation} not found`);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/${operation.toLowerCase()}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
            'X-Org-Id': orgId,
          },
          body: JSON.stringify(params),
          signal: AbortSignal.timeout(op.timeout),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new AdapterError('RateLimited', 'Rate limit exceeded');
        }
        if (response.status >= 400) {
          throw new AdapterError('ApiError', `API error: ${response.status}`);
        }
      }

      return response.json();
    } catch (error: any) {
      if (error instanceof AdapterError) throw error;
      if (error.name === 'AbortError') {
        throw new AdapterError('Timeout', 'Request timeout');
      }
      throw new AdapterError('Unknown', error.message);
    }
  }

  resolveCapabilities(orgId: string, channel: string): string[] {
    // Mock: return all operations (real impl checks org tier)
    return Object.keys(OPERATIONS_CATALOG);
  }
}
