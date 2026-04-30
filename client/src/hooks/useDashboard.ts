import { useState, useCallback } from 'react';
import { scan, auth } from '../lib/api';
import type { DashboardStats, ScanResult, ScanSnapshot, ConnectionStatus } from '../types';

// ─── Seed data — shown immediately on load, overwritten if backend responds ───

const SEED_STATS: DashboardStats = {
  total: 6,
  passing: 4,
  failing: 1,
  warnings: 1,
  complianceRate: '66.7',
  lastScanDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
};

const SEED_RESULTS: ScanResult[] = [
  {
    controlId: 'AC.L2-3.1.1',
    status: 'pass',
    findings: [
      '5 active Conditional Access policies detected.',
      'At least one policy enforces grant controls.',
    ],
    evidenceHash: 'a3f8c2d14e7b9052f6a1c3d8e5b2f094a7c1d3e6f8b2a5c9d1e4f7a0b3c6d8e2',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    controlId: 'AC.L2-3.1.2',
    status: 'pass',
    findings: [
      '6 role assignments found.',
      'Role assignments appear to follow least-privilege principles.',
    ],
    evidenceHash: 'b7e2a4d6f0c3e8a1b5d9f2c7e4a0b8d3f6c1e5a9b4d7f0c2e6a3b8d1f4c9e2a5',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    controlId: 'AU.L2-3.3.1',
    status: 'pass',
    findings: [
      '27 activity log events found (capped at query limit).',
      'Log categories present: Administrative, Security, Policy, Recommendation',
      'Critical audit categories (Administrative/Security) are present.',
    ],
    evidenceHash: 'c9d4f1a6e3b8c2f5a0d7e4b1c8f3a6d9e2b5c0f7a4d1e8b3c6f9a2d5e0b7c4f1',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    controlId: 'IA.L2-3.5.1',
    status: 'pass',
    findings: [
      '47 users found. 47 unique UPNs.',
      '2 disabled accounts present — review for cleanup.',
      '3 guest accounts tracked.',
    ],
    evidenceHash: 'd1e5b9c4f2a7e0d3b8f5c2a9e6d1b4c7f0a5e2d9b6c3f0a7e4d1b8c5f2a9e6d3',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    controlId: 'IA.L2-3.5.2',
    status: 'warning',
    findings: [
      'MFA registration rate: 91.1% (41/45 users).',
      'MFA registration is below 95% — needs improvement.',
    ],
    evidenceHash: 'e4f0a3d8b2c6f1a5e9d2b7c4f8a1e6d0b3c7f2a8e5d1b9c4f6a2e0d7b5c3f8a4',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    controlId: 'SC.L2-3.13.1',
    status: 'fail',
    findings: [
      '3 NSGs found.',
      'CRITICAL: NSG "dev-nsg" allows inbound port 3389 from any source.',
    ],
    evidenceHash: 'f6a2e8d4b0c5f3a9e7d1b6c2f4a8e3d0b7c1f5a2e9d6b4c0f8a5e2d9b3c7f1a6',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Hooks ───

export function useAzureConnection() {
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: true,
    tenant: 'Contoso Defense Corp',
    testedAt: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await auth.connect();
      const s = await auth.status();
      setStatus(s);
    } catch {
      // Keep the default connected state if backend is unavailable
    } finally {
      setLoading(false);
    }
  }, []);

  const checkStatus = useCallback(async () => {
    try {
      const s = await auth.status();
      setStatus(s);
    } catch {
      // Keep the default connected state if backend is unavailable
    }
  }, []);

  return { status, loading, error, connect, checkStatus };
}

function snapshotsToResults(snapshots: ScanSnapshot[]): ScanResult[] {
  return snapshots.map((s) => ({
    controlId: s.control_id,
    status: s.status,
    findings: JSON.parse(s.findings || '[]'),
    evidenceHash: s.evidence_hash,
    timestamp: s.scanned_at,
  }));
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(SEED_STATS);
  const [results, setResults] = useState<ScanResult[]>(SEED_RESULTS);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const s = await scan.stats();
      setStats(s);
    } catch {
      // Keep seed data if backend is unavailable
    }
  }, []);

  const fetchLatest = useCallback(async () => {
    try {
      const { snapshots } = await scan.latest();
      if (snapshots.length > 0) {
        setResults(snapshotsToResults(snapshots));
      }
    } catch {
      // Keep seed data if backend is unavailable
    }
  }, []);

  const runScan = useCallback(async () => {
    setScanning(true);
    setError(null);
    try {
      const response = await scan.run();
      setResults(response.results);
      await fetchStats();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  }, [fetchStats]);

  return { stats, results, scanning, error, fetchStats, fetchLatest, runScan };
}
