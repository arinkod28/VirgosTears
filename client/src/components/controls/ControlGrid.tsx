import React from 'react';
import ControlCard from './ControlCard';
import { CONTROLS, CONTROL_IDS } from '../../lib/controls';
import type { ScanResult } from '../../types';

interface Props {
  results: ScanResult[];
  connected: boolean;
  onRequestEvidence: (controlId: string) => void;
}

/**
 * Grid of all 6 CMMC control cards
 */
export default function ControlGrid({ results, connected, onRequestEvidence }: Props) {
  // Build a lookup map from scan results
  const resultMap = new Map(results.map((r) => [r.controlId, r]));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {CONTROL_IDS.map((id) => {
        const result = resultMap.get(id);
        return (
          <ControlCard
            key={id}
            control={CONTROLS[id]}
            status={result?.status || 'pending'}
            findings={result?.findings || []}
            evidenceHash={result?.evidenceHash || null}
            lastScanned={result?.timestamp || null}
            connected={connected}
            onRequestEvidence={onRequestEvidence}
          />
        );
      })}
    </div>
  );
}
