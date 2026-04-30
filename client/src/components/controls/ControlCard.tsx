import React from 'react';
import type { CMMCControl, ControlStatus } from '../../types';

interface Props {
  control: CMMCControl;
  status: ControlStatus;
  findings: string[];
  evidenceHash: string | null;
  lastScanned: string | null;
  onRequestEvidence: (controlId: string) => void;
}

const STATUS_CONFIG: Record<ControlStatus, { label: string; bg: string; dot: string }> = {
  pass: { label: 'PASS', bg: 'bg-green-500/10 border-green-500/30', dot: 'bg-green-500' },
  fail: { label: 'FAIL', bg: 'bg-red-500/10 border-red-500/30', dot: 'bg-red-500' },
  warning: { label: 'WARNING', bg: 'bg-amber-500/10 border-amber-500/30', dot: 'bg-amber-500' },
  error: { label: 'ERROR', bg: 'bg-slate-500/10 border-slate-500/30', dot: 'bg-slate-500' },
  pending: { label: 'PENDING', bg: 'bg-slate-500/10 border-slate-500/30', dot: 'bg-slate-600' },
};

export default function ControlCard({
  control,
  status,
  findings,
  evidenceHash,
  lastScanned,
  onRequestEvidence,
}: Props) {
  const config = STATUS_CONFIG[status];

  return (
    <div className={`rounded-lg border p-5 ${config.bg}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${config.dot}`} />
            <span className="text-xs font-mono text-slate-400">{control.id}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-navy-600 text-slate-300">
              {config.label}
            </span>
          </div>
          <h3 className="text-sm font-semibold mt-1">{control.title}</h3>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-3 leading-relaxed">{control.requirement}</p>

      <div className="text-xs text-slate-500 mb-3">
        Source: <span className="text-blue-400">{control.azureSource}</span>
      </div>

      {findings.length > 0 && (
        <div className="mb-3 space-y-1">
          {findings.map((finding, index) => (
            <p key={index} className="text-xs text-slate-300">
              &ndash; {finding}
            </p>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        {evidenceHash ? (
          <code className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">
            SHA-256: {evidenceHash.slice(0, 16)}&hellip;
          </code>
        ) : (
          <span className="text-[10px] text-slate-600">No evidence collected yet</span>
        )}
        <button
          onClick={() => onRequestEvidence(control.id)}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          View Evidence &rarr;
        </button>
      </div>

      {lastScanned && (
        <p className="text-[10px] text-slate-600 mt-2">
          Last scanned: {new Date(lastScanned).toLocaleString()}
        </p>
      )}
    </div>
  );
}
