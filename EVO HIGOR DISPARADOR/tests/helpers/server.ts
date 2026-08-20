import http from 'http';
import type { AddressInfo } from 'net';
import type { Express } from 'express';

export async function startServer(app: Express) {
  const server = http.createServer(app as any);

  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  return {
    baseUrl,
    close: async () => {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    },
  };
}

export async function requestJson(
  baseUrl: string,
  path: string,
  options: RequestInit = {},
) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  return {
    status: response.status,
    ok: response.ok,
    data,
  };
}
