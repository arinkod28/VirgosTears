import React from 'react';
import type { ConnectionStatus } from '../../types';

interface Props {
  status: ConnectionStatus;
  loading: boolean;
  error: string | null;
  onConnect: () => void;
}

/**
 * Azure connection panel — shown when not yet connected
 * Displays tenant info once connected
 */
export default function AzureConnect({ status, loading, error, onConnect }: Props) {
  if (status.connected) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <div>
            <p className="text-sm font-medium text-green-400">Connected to Azure</p>
            <p className="text-xs text-slate-400">Tenant: {status.tenant}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Since {new Date(status.testedAt!).toLocaleString()}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-navy-700 border border-navy-600 rounded-lg p-8 text-center">
      <div className="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
        {/* Azure icon placeholder */}
        <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold mb-2">Connect to Microsoft Azure</h2>
      <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
        Connect your Azure AD tenant to start scanning CMMC Level 2 controls.
        This requires an App Registration with the correct API permissions.
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        onClick={onConnect}
        disabled={loading}
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-sm font-medium transition-colors"
      >
        {loading ? 'Connecting...' : 'Connect Azure Tenant'}
      </button>
    </div>
  );
}
