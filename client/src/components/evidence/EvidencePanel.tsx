import React, { useState } from 'react';
import { evidence } from '../../lib/api';
import type { EvidenceResponse } from '../../types';
import { CONTROLS } from '../../lib/controls';

interface Props {
  controlId: string;
  connected?: boolean;
  onConnect?: () => void;
  onClose: () => void;
}

/**
 * Evidence detail panel - fetches live evidence and displays raw data plus hash.
 */
export default function EvidencePanel({
  controlId,
  connected = true,
  onConnect,
  onClose,
}: Props) {
  const [data, setData] = useState<EvidenceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  const control = CONTROLS[controlId];

  const fetchEvidence = async () => {
    if (!connected) return;

    setLoading(true);
    setError(null);
    try {
      const result = await evidence.get(controlId);
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-navy-800 border border-navy-600 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-navy-600">
          <div>
            <p className="text-xs text-slate-500 font-mono">{controlId}</p>
            <h2 className="text-lg font-semibold">{control?.title}</h2>
            <p className="text-xs text-slate-400 mt-1">Source: {control?.azureSource}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-xl"
          >
            x
          </button>
        </div>

        <div className="p-6">
          {!data && !loading && (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400 mb-4">
                {connected
                  ? 'Fetch live evidence from Azure for this control.'
                  : 'This control is visible now, but live evidence requires an Azure connection.'}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={fetchEvidence}
                  disabled={!connected}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-sm font-medium transition-colors"
                >
                  Fetch Evidence from Azure
                </button>
                {!connected && onConnect && (
                  <button
                    onClick={onConnect}
                    className="px-6 py-2.5 bg-navy-700 hover:bg-navy-600 border border-navy-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    Connect Azure Tenant
                  </button>
                )}
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400 animate-pulse">Querying Azure APIs...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {data && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-mono font-bold status-${data.status}`}>
                  {data.status.toUpperCase()}
                </span>
                <span className="text-xs text-slate-500">{data.recordCount} records retrieved</span>
              </div>

              <div className="bg-navy-700 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Findings</p>
                {data.findings.map((finding, index) => (
                  <p key={index} className="text-sm text-slate-300 mb-1">
                    - {finding}
                  </p>
                ))}
              </div>

              <div className="bg-navy-700 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Evidence Hash (SHA-256)
                </p>
                <code className="text-xs text-green-400 font-mono break-all">
                  {data.evidenceHash}
                </code>
                <p className="text-[10px] text-slate-600 mt-2">Timestamp: {data.timestamp}</p>
              </div>

              <div>
                <button
                  onClick={() => setShowRaw(!showRaw)}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {showRaw ? 'Hide' : 'Show'} Raw API Response
                </button>
                {showRaw && (
                  <pre className="mt-2 bg-navy-900 rounded-lg p-4 text-[10px] text-slate-400 font-mono overflow-x-auto max-h-60">
                    {JSON.stringify(data.rawData, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
