import React from 'react';
import ControlCard from './ControlCard';
import { CONTROLS, CONTROL_IDS } from '../../lib/controls';
import type { ScanResult } from '../../types';

interface Props {
  results: ScanResult[];
  onRequestEvidence: (controlId: string) => void;
}

export default function ControlGrid({ results, onRequestEvidence }: Props) {
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
            onRequestEvidence={onRequestEvidence}
          />
        );
      })}
    </div>
  );
}
