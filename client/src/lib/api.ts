import type {
  ConnectionStatus,
  DashboardStats,
  ScanResult,
  ScanSnapshot,
  EvidenceResponse,
  HashVerification,
  ChatMessage,
} from '../types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Auth ───

export const auth = {
  connect: () => request<{ success: boolean; tenant: string }>('/auth/connect', { method: 'POST' }),
  status: () => request<ConnectionStatus>('/auth/status'),
};

// ─── Scan ───

export const scan = {
  run: () =>
    request<{ success: boolean; scannedAt: string; results: ScanResult[] }>('/scan/run', {
      method: 'POST',
    }),
  latest: () => request<{ snapshots: ScanSnapshot[] }>('/scan/latest'),
  stats: () => request<DashboardStats>('/scan/stats'),
  history: (controlId: string, limit = 10) =>
    request<{ controlId: string; history: ScanSnapshot[] }>(
      `/scan/history/${controlId}?limit=${limit}`
    ),
};

// ─── Evidence ───

export const evidence = {
  get: (controlId: string) => request<EvidenceResponse>(`/evidence/${controlId}`),
  verify: (controlId: string, hash: string) =>
    request<HashVerification>(`/evidence/${controlId}/verify/${hash}`),
};

// ─── Chat ───

export const chat = {
  send: (message: string, sessionId: string) =>
    request<{ reply: string; sessionId: string }>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId }),
    }),
  history: (sessionId: string) =>
    request<{ sessionId: string; messages: ChatMessage[] }>(`/chat/history/${sessionId}`),
};
