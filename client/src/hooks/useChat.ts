import { useState, useCallback, useRef } from 'react';
import type { ChatMessage } from '../types';

// ─── Mock evidence data matching the seed results in useDashboard ───

const EVIDENCE = {
  'AC.L2-3.1.1': {
    status: 'PASS',
    findings: [
      '5 active Conditional Access policies detected.',
      'At least one policy enforces grant controls.',
    ],
    recordCount: 5,
    hash: 'a3f8c2d14e7b9052f6a1c3d8e5b2f094a7c1d3e6f8b2a5c9d1e4f7a0b3c6d8e2',
    source: 'Conditional Access Policies',
    detail: 'Policies in place: Require MFA for All Users, Block Legacy Auth, Require Compliant Device, Restrict Admin to Trusted Locations, Sign-in Frequency for Privileged Roles.',
  },
  'AC.L2-3.1.2': {
    status: 'PASS',
    findings: [
      '6 role assignments found.',
      'Role assignments appear to follow least-privilege principles.',
    ],
    recordCount: 6,
    hash: 'b7e2a4d6f0c3e8a1b5d9f2c7e4a0b8d3f6c1e5a9b4d7f0c2e6a3b8d1f4c9e2a5',
    source: 'RBAC Role Assignments',
    detail: '2 Owner assignments (below the 3-assignment threshold). Remaining 4 are Contributor/Reader scoped to specific resource groups.',
  },
  'AU.L2-3.3.1': {
    status: 'PASS',
    findings: [
      '27 activity log events found (capped at query limit).',
      'Log categories present: Administrative, Security, Policy, Recommendation',
      'Critical audit categories (Administrative/Security) are present.',
    ],
    recordCount: 27,
    hash: 'c9d4f1a6e3b8c2f5a0d7e4b1c8f3a6d9e2b5c0f7a4d1e8b3c6f9a2d5e0b7c4f1',
    source: 'Activity Logs',
    detail: 'Logs span the last 90 days. Administrative and Security categories confirmed present, satisfying CMMC AU.L2-3.3.1 requirements.',
  },
  'IA.L2-3.5.1': {
    status: 'PASS',
    findings: [
      '47 users found. 47 unique UPNs.',
      '2 disabled accounts present — review for cleanup.',
      '3 guest accounts tracked.',
    ],
    recordCount: 47,
    hash: 'd1e5b9c4f2a7e0d3b8f5c2a9e6d1b4c7f0a5e2d9b6c3f0a7e4d1b8c5f2a9e6d3',
    source: 'Azure AD Users',
    detail: 'All 47 users have unique UPNs. 44 Member accounts, 3 Guest accounts. 2 disabled accounts should be reviewed for deprovisioning.',
  },
  'IA.L2-3.5.2': {
    status: 'WARNING',
    findings: [
      'MFA registration rate: 91.1% (41/45 users).',
      'MFA registration is below 95% — needs improvement.',
    ],
    recordCount: 45,
    hash: 'e4f0a3d8b2c6f1a5e9d2b7c4f8a1e6d0b3c7f2a8e5d1b9c4f6a2e0d7b5c3f8a4',
    source: 'MFA Registration Status',
    detail: '4 users have not registered MFA. Authenticator app is the primary method for enrolled users. Remediation: enforce MFA registration via Conditional Access for the remaining 4 accounts.',
  },
  'SC.L2-3.13.1': {
    status: 'FAIL',
    findings: [
      '3 NSGs found.',
      'CRITICAL: NSG "dev-nsg" allows inbound port 3389 from any source.',
    ],
    recordCount: 3,
    hash: 'f6a2e8d4b0c5f3a9e7d1b6c2f4a8e3d0b7c1f5a2e9d6b4c0f8a5e2d9b3c7f1a6',
    source: 'Network Security Groups',
    detail: 'NSG "dev-nsg" in resource group rg-dev has an inbound Allow rule for TCP port 3389 (RDP) from 0.0.0.0/0. This must be remediated immediately. Recommended fix: restrict source to a specific jump-host IP or use Azure Bastion.',
  },
};

const CONTROL_IDS = Object.keys(EVIDENCE);

function buildEvidenceReply(id: string): string {
  const e = EVIDENCE[id as keyof typeof EVIDENCE];
  if (!e) return `No evidence data found for control ${id}.`;

  return [
    `**${id} — ${e.status}**`,
    `Source: ${e.source} (${e.recordCount} records retrieved)`,
    ``,
    `**Findings:**`,
    ...e.findings.map((f) => `  • ${f}`),
    ``,
    e.detail,
    ``,
    `**Evidence Hash (SHA-256):**`,
    `  ${e.hash}`,
    ``,
    `This hash can be used to verify the integrity of the evidence at the time of collection.`,
  ].join('\n');
}

function mockReply(message: string): string {
  const lower = message.toLowerCase();

  // Check for specific control IDs
  const matched = CONTROL_IDS.find((id) => lower.includes(id.toLowerCase()));
  if (matched) return buildEvidenceReply(matched);

  // Thematic questions
  if (lower.includes('mfa') || lower.includes('multi-factor') || lower.includes('authentication')) {
    return buildEvidenceReply('IA.L2-3.5.2');
  }

  if (lower.includes('nsg') || lower.includes('network security') || lower.includes('rdp') || lower.includes('ssh') || lower.includes('boundary') || lower.includes('port')) {
    return buildEvidenceReply('SC.L2-3.13.1');
  }

  if (lower.includes('audit') || lower.includes('log') || lower.includes('activity')) {
    return buildEvidenceReply('AU.L2-3.3.1');
  }

  if (lower.includes('conditional access') || lower.includes('access control') || lower.includes('policy') || lower.includes('ac.l2')) {
    return buildEvidenceReply('AC.L2-3.1.1');
  }

  if (lower.includes('rbac') || lower.includes('role') || lower.includes('assignment') || lower.includes('privilege')) {
    return buildEvidenceReply('AC.L2-3.1.2');
  }

  if (lower.includes('user') || lower.includes('identif') || lower.includes('upn') || lower.includes('guest') || lower.includes('account')) {
    return buildEvidenceReply('IA.L2-3.5.1');
  }

  if (lower.includes('summary') || lower.includes('overview') || lower.includes('status') || lower.includes('dashboard') || lower.includes('compliance')) {
    return [
      `**CMMC Level 2 Compliance Summary — Contoso Defense Corp**`,
      ``,
      `Overall compliance rate: 66.7% (4/6 controls passing)`,
      ``,
      `✅  AC.L2-3.1.1  Authorized Access Control        PASS`,
      `✅  AC.L2-3.1.2  Transaction & Function Control   PASS`,
      `✅  AU.L2-3.3.1  System Audit                     PASS`,
      `✅  IA.L2-3.5.1  Identification                   PASS`,
      `⚠️  IA.L2-3.5.2  Authentication (MFA)             WARNING  — 91.1% registration`,
      `❌  SC.L2-3.13.1  Boundary Protection              FAIL     — open RDP on dev-nsg`,
      ``,
      `**Priority actions:**`,
      `1. Enforce MFA registration for 4 remaining users (IA.L2-3.5.2)`,
      `2. Restrict or remove inbound RDP rule on dev-nsg (SC.L2-3.13.1)`,
    ].join('\n');
  }

  if (lower.includes('fail') || lower.includes('issue') || lower.includes('problem') || lower.includes('vulnerab') || lower.includes('risk')) {
    return [
      `**Current compliance issues:**`,
      ``,
      `**FAIL — SC.L2-3.13.1 (Boundary Protection)**`,
      `NSG "dev-nsg" has an inbound Allow rule for TCP 3389 (RDP) from 0.0.0.0/0.`,
      `This exposes RDP to the public internet and is a critical finding.`,
      `Evidence hash: f6a2e8d4b0c5f3a9e7d1b6c2f4a8e3d0b7c1f5a2e9d6b4c0f8a5e2d9b3c7f1a6`,
      ``,
      `**WARNING — IA.L2-3.5.2 (Authentication)**`,
      `MFA registration is at 91.1% — below the required 95% threshold.`,
      `4 users are not enrolled in MFA.`,
      `Evidence hash: e4f0a3d8b2c6f1a5e9d2b7c4f8a1e6d0b3c7f2a8e5d1b9c4f6a2e0d7b5c3f8a4`,
    ].join('\n');
  }

  // Generic fallback
  return [
    `I can help you review CMMC Level 2 compliance evidence for any of the 6 monitored controls:`,
    ``,
    `  • AC.L2-3.1.1  — Conditional Access Policies`,
    `  • AC.L2-3.1.2  — RBAC Role Assignments`,
    `  • AU.L2-3.3.1  — Activity Logs`,
    `  • IA.L2-3.5.1  — Azure AD Users`,
    `  • IA.L2-3.5.2  — MFA Registration`,
    `  • SC.L2-3.13.1 — Network Security Groups`,
    ``,
    `Try: "Give me evidence for SC.L2-3.13.1" or "What is our MFA compliance rate?"`,
  ].join('\n');
}

// ─── Hook ───

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = { role: 'user', content };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    // Simulate a short thinking delay
    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));

    const reply = mockReply(content);
    setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    setLoading(false);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    sessionIdRef.current = crypto.randomUUID();
  }, []);

  return { messages, loading, error, sendMessage, clearChat };
}
