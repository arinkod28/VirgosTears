// ─── Control Types ───

export type ControlStatus = 'pass' | 'fail' | 'warning' | 'error' | 'pending';

export interface CMMCControl {
  id: string;
  family: string;
  title: string;
  requirement: string;
  azureSource: string;
}

export interface ScanResult {
  controlId: string;
  status: ControlStatus;
  findings: string[];
  evidenceHash: string | null;
  timestamp: string;
}

export interface ScanSnapshot {
  id: number;
  control_id: string;
  raw_json: string;
  evidence_hash: string;
  status: ControlStatus;
  findings: string;
  scanned_at: string;
}

// ─── Dashboard Types ───

export interface DashboardStats {
  total: number;
  passing: number;
  failing: number;
  warnings: number;
  complianceRate: string;
  lastScanDate: string | null;
}

// ─── Chat Types ───

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

// ─── Auth Types ───

export interface ConnectionStatus {
  connected: boolean;
  tenant: string | null;
  testedAt: string | null;
}

// ─── Evidence Types ───

export interface EvidenceResponse {
  controlId: string;
  status: ControlStatus;
  findings: string[];
  evidenceHash: string;
  timestamp: string;
  recordCount: number;
  rawData: unknown;
}

export interface HashVerification {
  verified: boolean;
  controlId: string;
  hash: string;
  scannedAt: string;
  status: ControlStatus;
}
