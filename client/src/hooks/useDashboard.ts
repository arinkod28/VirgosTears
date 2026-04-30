import { useState, useCallback } from 'react';
import { scan, auth } from '../lib/api';
import type { DashboardStats, ScanResult, ScanSnapshot, ConnectionStatus } from '../types';

export function useAzureConnection() {
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    tenant: null,
    testedAt: null,
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkStatus = useCallback(async () => {
    try {
      const s = await auth.status();
      setStatus(s);
    } catch {
      // Silently fail — backend may not be ready yet
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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const s = await scan.stats();
      setStats(s);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const fetchLatest = useCallback(async () => {
    try {
      const { snapshots } = await scan.latest();
      setResults(snapshotsToResults(snapshots));
    } catch {
      // Silently fail on initial load
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
