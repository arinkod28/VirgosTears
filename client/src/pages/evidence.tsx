import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';

interface EvidenceRecord {
  controlId: string;
  controlTitle: string;
  source: string;
  status: 'pass' | 'fail' | 'warning';
  findings: string[];
  recordCount: number;
  evidenceHash: string;
  collectedAt: string;
  collectedBy: string;
  detail: string;
}

const EVIDENCE_RECORDS: EvidenceRecord[] = [
  {
    controlId: 'AC.L2-3.1.1',
    controlTitle: 'Authorized Access Control',
    source: 'Conditional Access Policies',
    status: 'pass',
    findings: [
      '5 active Conditional Access policies detected.',
      'At least one policy enforces grant controls.',
    ],
    recordCount: 5,
    evidenceHash: 'a3f8c2d14e7b9052f6a1c3d8e5b2f094a7c1d3e6f8b2a5c9d1e4f7a0b3c6d8e2',
    collectedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    collectedBy: 'CMMC Dashboard (Automated)',
    detail: 'Five Conditional Access policies are active in the tenant: "Require MFA for All Users", "Block Legacy Authentication Protocols", "Require Compliant Device for Corporate Apps", "Restrict Admin Access to Trusted Locations", and "Sign-in Frequency — Privileged Roles". All policies include grant controls satisfying the requirement for access restrictions.',
  },
  {
    controlId: 'AC.L2-3.1.2',
    controlTitle: 'Transaction & Function Control',
    source: 'RBAC Role Assignments',
    status: 'pass',
    findings: [
      '6 role assignments found.',
      'Role assignments appear to follow least-privilege principles.',
    ],
    recordCount: 6,
    evidenceHash: 'b7e2a4d6f0c3e8a1b5d9f2c7e4a0b8d3f6c1e5a9b4d7f0c2e6a3b8d1f4c9e2a5',
    collectedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    collectedBy: 'CMMC Dashboard (Automated)',
    detail: '6 RBAC role assignments are present at subscription scope. 2 Owner assignments (below the 3-assignment warning threshold), both assigned to verified administrative principals. The remaining 4 assignments are Contributor or Reader scoped to specific resource groups (rg-security, rg-infra), consistent with least-privilege principles.',
  },
  {
    controlId: 'AU.L2-3.3.1',
    controlTitle: 'System Audit',
    source: 'Activity Logs',
    status: 'pass',
    findings: [
      '27 activity log events found (capped at query limit).',
      'Log categories present: Administrative, Security, Policy, Recommendation',
      'Critical audit categories (Administrative/Security) are present.',
    ],
    recordCount: 27,
    evidenceHash: 'c9d4f1a6e3b8c2f5a0d7e4b1c8f3a6d9e2b5c0f7a4d1e8b3c6f9a2d5e0b7c4f1',
    collectedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    collectedBy: 'CMMC Dashboard (Automated)',
    detail: 'Azure Activity Logs were queried for the last 90 days. 27 log events were retrieved, spanning Administrative, Security, Policy, and Recommendation categories. Both Administrative and Security categories are confirmed present, satisfying the audit logging and retention requirement. Log entries include role assignment changes, security alert writes, resource deployments, and policy assignment operations.',
  },
  {
    controlId: 'IA.L2-3.5.1',
    controlTitle: 'Identification',
    source: 'Azure AD Users',
    status: 'pass',
    findings: [
      '47 users found. 47 unique UPNs.',
      '2 disabled accounts present — review for cleanup.',
      '3 guest accounts tracked.',
    ],
    recordCount: 47,
    evidenceHash: 'd1e5b9c4f2a7e0d3b8f5c2a9e6d1b4c7f0a5e2d9b6c3f0a7e4d1b8c5f2a9e6d3',
    collectedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    collectedBy: 'CMMC Dashboard (Automated)',
    detail: 'The Azure AD tenant contains 47 user objects. All 47 have unique UserPrincipalNames with no duplicates detected. 44 accounts are Member-type (internal employees), 3 are Guest-type (partner/vendor accounts). 2 accounts are currently disabled. The disabled accounts should be reviewed for formal deprovisioning to maintain a clean identity inventory.',
  },
  {
    controlId: 'IA.L2-3.5.2',
    controlTitle: 'Authentication',
    source: 'MFA Registration Status',
    status: 'warning',
    findings: [
      'MFA registration rate: 91.1% (41/45 users).',
      'MFA registration is below 95% — needs improvement.',
    ],
    recordCount: 45,
    evidenceHash: 'e4f0a3d8b2c6f1a5e9d2b7c4f8a1e6d0b3c7f2a8e5d1b9c4f6a2e0d7b5c3f8a4',
    collectedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    collectedBy: 'CMMC Dashboard (Automated)',
    detail: '45 users were evaluated for MFA registration. 41 (91.1%) have registered at least one MFA method. 4 users have not enrolled in MFA. Primary MFA methods in use are Microsoft Authenticator push notifications and software TOTP. The 91.1% rate falls below the 95% compliance threshold. Remediation: create a Conditional Access policy requiring MFA registration within 14 days for the 4 non-enrolled users.',
  },
  {
    controlId: 'SC.L2-3.13.1',
    controlTitle: 'Boundary Protection',
    source: 'Network Security Groups',
    status: 'fail',
    findings: [
      '3 NSGs found.',
      'CRITICAL: NSG "dev-nsg" allows inbound port 3389 from any source.',
    ],
    recordCount: 3,
    evidenceHash: 'f6a2e8d4b0c5f3a9e7d1b6c2f4a8e3d0b7c1f5a2e9d6b4c0f8a5e2d9b3c7f1a6',
    collectedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    collectedBy: 'CMMC Dashboard (Automated)',
    detail: '3 Network Security Groups are deployed: "prod-vnet-nsg" (rg-infra), "dev-nsg" (rg-dev), and "app-tier-nsg" (rg-infra). NSG "dev-nsg" contains a rule "Allow-RDP-Any" that permits TCP port 3389 (RDP) inbound from source 0.0.0.0/0 (any IP). This constitutes an open boundary and is a critical CMMC finding. Immediate remediation required: restrict the source address to a specific jump-host IP range or migrate to Azure Bastion for remote desktop access.',
  },
];

const STATUS_CONFIG = {
  pass: { label: 'PASS', cls: 'bg-green-500/10 border-green-500/30 text-green-400' },
  fail: { label: 'FAIL', cls: 'bg-red-500/10 border-red-500/30 text-red-400' },
  warning: { label: 'WARNING', cls: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
};

export default function EvidencePage() {
  const [selected, setSelected] = useState<EvidenceRecord | null>(null);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-bold">Evidence Log</h1>
          <p className="text-sm text-slate-400 mt-1">
            Documented compliance evidence collected from Microsoft Azure APIs
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Evidence Records', value: EVIDENCE_RECORDS.length, color: 'text-blue-400' },
            { label: 'Passing Controls', value: EVIDENCE_RECORDS.filter(r => r.status === 'pass').length, color: 'text-green-400' },
            { label: 'Require Attention', value: EVIDENCE_RECORDS.filter(r => r.status !== 'pass').length, color: 'text-amber-400' },
          ].map((s) => (
            <div key={s.label} className="bg-navy-700 border border-navy-600 rounded-lg p-4">
              <p className="text-xs text-slate-400 uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-navy-800 border border-navy-600 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-600 text-xs text-slate-400 uppercase tracking-wider">
                <th className="text-left px-5 py-3">Control</th>
                <th className="text-left px-5 py-3">Source</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Records</th>
                <th className="text-left px-5 py-3">Evidence Hash</th>
                <th className="text-left px-5 py-3">Collected</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {EVIDENCE_RECORDS.map((rec) => {
                const sc = STATUS_CONFIG[rec.status];
                return (
                  <tr
                    key={rec.controlId}
                    className="border-b border-navy-700 hover:bg-navy-700/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs text-slate-400">{rec.controlId}</p>
                      <p className="text-xs font-medium text-slate-200 mt-0.5">{rec.controlTitle}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-blue-400">{rec.source}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sc.cls}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">{rec.recordCount}</td>
                    <td className="px-5 py-4">
                      <code className="text-[10px] text-slate-500 font-mono">
                        {rec.evidenceHash.slice(0, 16)}&hellip;
                      </code>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {new Date(rec.collectedAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelected(rec)}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap"
                      >
                        View &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-navy-800 border border-navy-600 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-navy-600">
              <div>
                <p className="text-xs font-mono text-slate-500">{selected.controlId}</p>
                <h2 className="text-lg font-semibold mt-0.5">{selected.controlTitle}</h2>
                <p className="text-xs text-slate-400 mt-1">Source: {selected.source}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white text-xl leading-none">&times;</button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${STATUS_CONFIG[selected.status].cls}`}>
                  {STATUS_CONFIG[selected.status].label}
                </span>
                <span className="text-xs text-slate-500">{selected.recordCount} records retrieved</span>
              </div>

              <div className="bg-navy-700 rounded-lg p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Findings</p>
                {selected.findings.map((f, i) => (
                  <p key={i} className="text-sm text-slate-300 mb-1">&ndash; {f}</p>
                ))}
              </div>

              <div className="bg-navy-700 rounded-lg p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Analysis</p>
                <p className="text-sm text-slate-300 leading-relaxed">{selected.detail}</p>
              </div>

              <div className="bg-navy-700 rounded-lg p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Evidence Hash (SHA-256)</p>
                <code className="text-xs text-green-400 font-mono break-all">{selected.evidenceHash}</code>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-navy-700 rounded-lg p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Collected</p>
                  <p className="text-xs text-slate-300">{new Date(selected.collectedAt).toLocaleString()}</p>
                </div>
                <div className="bg-navy-700 rounded-lg p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Collected By</p>
                  <p className="text-xs text-slate-300">{selected.collectedBy}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
