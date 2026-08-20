// tests/services/evolution.test.ts
import axios from 'axios';
import { EvolutionClient } from '../../src/services/evolution';

// Evolution API is external; axios is mocked so tests run offline.
// (Plan Task 3 note: "For real integration, you'd mock axios.")
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockHttp = {
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
};

describe('EvolutionClient', () => {
  let client: EvolutionClient;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockHttp as unknown as ReturnType<typeof axios.create>);

    mockHttp.get.mockResolvedValue({
      data: { pairingCode: null, code: 'qr-code-data', base64: 'data:image/png;base64,AAAA', count: 1 },
    });
    mockHttp.post.mockResolvedValue({
      data: { key: { id: 'msg-1' }, message: { text: 'Hello' }, status: 'sent' },
    });

    client = new EvolutionClient({
      baseUrl: 'http://localhost:8080',
      apiKey: 'test-key',
    });
  });

  it('should initialize with config', () => {
    expect(client).toBeDefined();
  });

  it('should connect instance and return QR code', async () => {
    // This will fail until we implement connectInstance
    const result = await client.connectInstance('test-instance');
    expect(result).toHaveProperty('base64');
    expect(result).toHaveProperty('code');
  });

  it('should send message and return response', async () => {
    const result = await client.sendMessage('test-instance', {
      number: '+5511987654321',
      text: 'Hello',
    });
    expect(result).toHaveProperty('key');
    expect(result.status).toBe('sent');
  });
});
