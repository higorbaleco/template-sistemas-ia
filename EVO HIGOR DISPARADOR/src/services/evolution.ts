// src/services/evolution.ts
import axios, { AxiosInstance } from 'axios';

export interface EvolutionConfig {
  baseUrl: string;
  apiKey: string;
}

export interface ConnectInstanceResponse {
  pairingCode: string | null;
  code: string;
  base64: string;
  count: number;
}

export interface SendMessagePayload {
  number: string;
  text: string;
}

export interface SendMessageResponse {
  key: { id: string };
  message: { text: string };
  status: string;
}

export interface InstanceStatusResponse {
  connected: boolean;
  phoneNumber?: string;
}

export class EvolutionClient {
  private http: AxiosInstance;

  constructor(config: EvolutionConfig) {
    this.http = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'apikey': config.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  async connectInstance(instanceName: string): Promise<ConnectInstanceResponse> {
    const response = await this.http.get<ConnectInstanceResponse>(
      `/instance/connect/${instanceName}`
    );
    return response.data;
  }

  async sendMessage(
    instanceName: string,
    payload: SendMessagePayload
  ): Promise<SendMessageResponse> {
    const response = await this.http.post<SendMessageResponse>(
      `/message/sendText/${instanceName}`,
      {
        number: payload.number,
        text: payload.text,
      }
    );
    return response.data;
  }

  async getInstanceStatus(instanceName: string): Promise<InstanceStatusResponse> {
    const response = await this.http.get<InstanceStatusResponse>(
      `/instance/fetch/${instanceName}`
    );
    return response.data;
  }

  async logoutInstance(instanceName: string): Promise<void> {
    await this.http.delete(`/instance/logout/${instanceName}`);
  }
}
