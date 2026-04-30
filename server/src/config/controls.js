/**
 * CMMC Level 2 Controls — the 6 we monitor via Azure
 * Single source of truth for control metadata and pass/fail logic
 */

const CONTROLS = {
  'AC.L2-3.1.1': {
    id: 'AC.L2-3.1.1',
    family: 'Access Control',
    title: 'Authorized Access Control',
    requirement: 'Limit system access to authorized users, processes acting on behalf of users, and devices.',
    azureSource: 'Conditional Access Policies',
    apiType: 'graph', // 'graph' or 'arm'
    endpoint: '/identity/conditionalAccess/policies',
  },

  'AC.L2-3.1.2': {
    id: 'AC.L2-3.1.2',
    family: 'Access Control',
    title: 'Transaction & Function Control',
    requirement: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.',
    azureSource: 'RBAC Role Assignments',
    apiType: 'arm',
    endpoint: (subId) =>
      `/subscriptions/${subId}/providers/Microsoft.Authorization/roleAssignments?api-version=2022-04-01`,
  },

  'AU.L2-3.3.1': {
    id: 'AU.L2-3.3.1',
    family: 'Audit & Accountability',
    title: 'System Audit',
    requirement: 'Create and retain system audit logs and records to the extent needed to enable monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.',
    azureSource: 'Activity Logs',
    apiType: 'arm',
    endpoint: (subId) => {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
      return `/subscriptions/${subId}/providers/Microsoft.Insights/eventtypes/management/values?api-version=2015-04-01&$filter=eventTimestamp ge '${ninetyDaysAgo}'&$top=100`;
    },
  },

  'IA.L2-3.5.1': {
    id: 'IA.L2-3.5.1',
    family: 'Identification & Authentication',
    title: 'Identification',
    requirement: 'Identify system users, processes acting on behalf of users, and devices.',
    azureSource: 'Azure AD Users',
    apiType: 'graph',
    endpoint: '/users?$select=id,displayName,userPrincipalName,accountEnabled,userType,createdDateTime&$top=999',
  },

  'IA.L2-3.5.2': {
    id: 'IA.L2-3.5.2',
    family: 'Identification & Authentication',
    title: 'Authentication',
    requirement: 'Authenticate the identities of users, processes, or devices, as a prerequisite to allowing access to organizational systems.',
    azureSource: 'MFA Registration Status',
    apiType: 'graph',
    endpoint: '/reports/authenticationMethods/userRegistrationDetails',
  },

  'SC.L2-3.13.1': {
    id: 'SC.L2-3.13.1',
    family: 'System & Communications Protection',
    title: 'Boundary Protection',
    requirement: 'Monitor, control, and protect communications at the external and key internal boundaries of organizational systems.',
    azureSource: 'Network Security Groups',
    apiType: 'arm',
    endpoint: (subId) =>
      `/subscriptions/${subId}/providers/Microsoft.Network/networkSecurityGroups?api-version=2023-09-01`,
  },
};

const CONTROL_IDS = Object.keys(CONTROLS);

module.exports = { CONTROLS, CONTROL_IDS };
