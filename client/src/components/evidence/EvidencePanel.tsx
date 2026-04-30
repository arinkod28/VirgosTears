import React, { useState, useEffect } from 'react';
import { evidence } from '../../lib/api';
import type { EvidenceResponse } from '../../types';
import { CONTROLS } from '../../lib/controls';

interface Props {
  controlId: string;
  onClose: () => void;
}

export default function EvidencePanel({ controlId, onClose }: Props) {
  const [data, setData] = useState<EvidenceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  const control = CONTROLS[controlId];

  useEffect(() => {
    let cancelled = false;
    evidence
      .get(controlId)
      .then((result) => { if (!cancelled) setData(result); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [controlId]);

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
            className="text-slate-400 hover:text-white transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <p className="text-sm text-slate-400 animate-pulse">Fetching evidence...</p>
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
                <StatusBadge status={data.status} />
                <span className="text-xs text-slate-500">{data.recordCount} records retrieved</span>
              </div>

              <div className="bg-navy-700 rounded-lg p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Findings</p>
                {data.findings.map((finding, index) => (
                  <p key={index} className="text-sm text-slate-300 mb-1">
                    &ndash; {finding}
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
                <p className="text-[10px] text-slate-600 mt-2">Collected: {new Date(data.timestamp).toLocaleString()}</p>
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

const STATUS_COLORS: Record<string, string> = {
  pass: 'text-green-400 bg-green-500/10 border-green-500/30',
  fail: 'text-red-400 bg-red-500/10 border-red-500/30',
  warning: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  error: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
};

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_COLORS[status] || STATUS_COLORS.error;
  return (
    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${cls}`}>
      {status.toUpperCase()}
    </span>
  );
}
