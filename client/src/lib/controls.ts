import type { CMMCControl } from '../types';

export const CONTROLS: Record<string, CMMCControl> = {
  'AC.L2-3.1.1': {
    id: 'AC.L2-3.1.1',
    family: 'Access Control',
    title: 'Authorized Access Control',
    requirement:
      'Limit system access to authorized users, processes acting on behalf of users, and devices.',
    azureSource: 'Conditional Access Policies',
  },
  'AC.L2-3.1.2': {
    id: 'AC.L2-3.1.2',
    family: 'Access Control',
    title: 'Transaction & Function Control',
    requirement:
      'Limit system access to the types of transactions and functions that authorized users are permitted to execute.',
    azureSource: 'RBAC Role Assignments',
  },
  'AU.L2-3.3.1': {
    id: 'AU.L2-3.3.1',
    family: 'Audit & Accountability',
    title: 'System Audit',
    requirement:
      'Create and retain system audit logs and records to the extent needed to enable monitoring, analysis, investigation, and reporting.',
    azureSource: 'Activity Logs',
  },
  'IA.L2-3.5.1': {
    id: 'IA.L2-3.5.1',
    family: 'Identification & Authentication',
    title: 'Identification',
    requirement:
      'Identify system users, processes acting on behalf of users, and devices.',
    azureSource: 'Azure AD Users',
  },
  'IA.L2-3.5.2': {
    id: 'IA.L2-3.5.2',
    family: 'Identification & Authentication',
    title: 'Authentication',
    requirement:
      'Authenticate the identities of users, processes, or devices, as a prerequisite to allowing access.',
    azureSource: 'MFA Registration Status',
  },
  'SC.L2-3.13.1': {
    id: 'SC.L2-3.13.1',
    family: 'System & Communications Protection',
    title: 'Boundary Protection',
    requirement:
      'Monitor, control, and protect communications at external and key internal boundaries.',
    azureSource: 'Network Security Groups',
  },
};

export const CONTROL_IDS = Object.keys(CONTROLS);
