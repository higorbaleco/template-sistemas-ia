declare module "node:fs/promises" {
  export function readFile(path: string, options?: { encoding?: string }): Promise<string>;
  export function writeFile(path: string, data: string, options?: { encoding?: string }): Promise<void>;
  export function mkdir(path: string, options?: { recursive?: boolean }): Promise<string | undefined>;
  export function access(path: string): Promise<void>;
}

declare module "node:path" {
  export function dirname(path: string): string;
}

declare module "node:http" {
  export interface IncomingMessage {
    method?: string;
    url?: string;
    headers: Record<string, string | string[] | undefined>;
    on(event: "data", listener: (chunk: string | Buffer) => void): void;
    on(event: "end", listener: () => void): void;
  }

  export interface ServerResponse {
    statusCode: number;
    setHeader(name: string, value: string): void;
    end(data?: string): void;
  }

  export type RequestListener = (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;

  export interface Server {
    listen(port: number, hostname?: string, callback?: () => void): void;
    close(callback?: () => void): void;
  }

  export function createServer(listener: RequestListener): Server;
}

declare module "node:url" {
  export function parse(url: string, parseQueryString?: boolean): { pathname?: string | null; query?: Record<string, string> };
}

declare const Buffer: {
  from(input: string): Buffer;
};

interface Buffer {
  toString(encoding?: string): string;
}

declare const console: {
  log(...args: unknown[]): void;
  error(...args: unknown[]): void;
};

declare class URL {
  constructor(input: string, base?: string);
  pathname: string;
}
