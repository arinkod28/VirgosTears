import { useState, useCallback } from 'react';
import { scan, auth } from '../lib/api';
import type { DashboardStats, ScanResult, ConnectionStatus } from '../types';

/**
 * Hook for managing Azure connection state
 */
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
      // Silently fail — connection may not be set up yet
    }
  }, []);

  return { status, loading, error, connect, checkStatus };
}

/**
 * Hook for running scans and fetching dashboard data
 */
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

  const runScan = useCallback(async () => {
    setScanning(true);
    setError(null);
    try {
      const response = await scan.run();
      setResults(response.results);
      // Refresh stats after scan
      await fetchStats();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  }, [fetchStats]);

  return { stats, results, scanning, error, fetchStats, runScan };
}
