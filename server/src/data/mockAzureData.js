'use strict';

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

function generateActivityLogs(count) {
  const categories = [
    'Administrative', 'Security', 'Administrative', 'Policy', 'Administrative',
    'Security', 'Recommendation', 'Administrative', 'Security', 'Administrative',
  ];
  const operations = [
    'Microsoft.Authorization/roleAssignments/write',
    'Microsoft.Security/alerts/write',
    'Microsoft.Resources/deployments/write',
    'Microsoft.Compute/virtualMachines/start/action',
    'Microsoft.KeyVault/vaults/secrets/read',
    'Microsoft.Network/networkSecurityGroups/write',
    'Microsoft.Storage/storageAccounts/write',
    'Microsoft.Sql/servers/databases/write',
    'Microsoft.Authorization/policyAssignments/write',
    'Microsoft.Security/pricings/write',
  ];
  return Array.from({ length: count }, (_, i) => ({
    eventTimestamp: daysAgo(i * 3 + 1),
    category: { value: categories[i % categories.length] },
    operationName: { value: operations[i % operations.length] },
    status: { value: 'Succeeded' },
    level: 'Informational',
    resourceGroupName: ['rg-infra', 'rg-dev', 'rg-security'][i % 3],
    caller: `svc-account-${i}@contoso.onmicrosoft.com`,
    correlationId: `corr-${i.toString(16).padStart(8, '0')}-${Date.now().toString(16)}`,
  }));
}

function generateUsers(count) {
  const firstNames = ['James', 'Sarah', 'Michael', 'Emily', 'Robert', 'Jennifer', 'David', 'Jessica', 'John', 'Amanda'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Martinez', 'Davis', 'Anderson', 'Wilson'];
  return Array.from({ length: count }, (_, i) => {
    const first = firstNames[i % firstNames.length];
    const last = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const isGuest = i >= count - 3;
    const isDisabled = i === 10 || i === 22;
    return {
      id: `user-${i.toString(16).padStart(8, '0')}`,
      displayName: isGuest ? `${first} ${last} (Partner)` : `${first} ${last}`,
      userPrincipalName: isGuest
        ? `${first.toLowerCase()}.${last.toLowerCase()}_partner#EXT#@contoso.onmicrosoft.com`
        : `${first.toLowerCase()}.${last.toLowerCase()}${i > 9 ? i : ''}@contoso.com`,
      accountEnabled: !isDisabled,
      userType: isGuest ? 'Guest' : 'Member',
      createdDateTime: daysAgo(Math.floor(i * 14) + 30),
    };
  });
}

function generateMFARegistrations(total, mfaCount) {
  return Array.from({ length: total }, (_, i) => ({
    id: `user-${i.toString(16).padStart(8, '0')}`,
    userPrincipalName: `user${i}@contoso.com`,
    isMfaRegistered: i < mfaCount,
    isMfaCapable: i < mfaCount,
    defaultMfaMethod: i < mfaCount
      ? (i % 3 === 0 ? 'microsoftAuthenticatorPush' : 'softwareOneTimePasscode')
      : null,
  }));
}

// Realistic mock data for all 6 CMMC Level 2 controls
// Produces: AC.L2-3.1.1 → pass, AC.L2-3.1.2 → pass, AU.L2-3.3.1 → pass,
//           IA.L2-3.5.1 → pass, IA.L2-3.5.2 → warning (91% MFA), SC.L2-3.13.1 → fail (open RDP)
const MOCK_AZURE_DATA = {
  'AC.L2-3.1.1': {
    '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#identity/conditionalAccess/policies',
    value: [
      {
        id: 'ca-001-mfa-all-users',
        displayName: 'Require MFA for All Users',
        createdDateTime: daysAgo(180),
        modifiedDateTime: daysAgo(30),
        state: 'enabled',
        conditions: {
          users: { includeUsers: ['All'], excludeUsers: [] },
          applications: { includeApplications: ['All'] },
        },
        grantControls: { operator: 'OR', builtInControls: ['mfa'] },
      },
      {
        id: 'ca-002-block-legacy-auth',
        displayName: 'Block Legacy Authentication Protocols',
        createdDateTime: daysAgo(200),
        modifiedDateTime: daysAgo(14),
        state: 'enabled',
        conditions: {
          users: { includeUsers: ['All'], excludeUsers: [] },
          clientAppTypes: ['exchangeActiveSync', 'other'],
        },
        grantControls: { operator: 'OR', builtInControls: ['block'] },
      },
      {
        id: 'ca-003-compliant-device',
        displayName: 'Require Compliant Device for Corporate Apps',
        createdDateTime: daysAgo(120),
        modifiedDateTime: daysAgo(7),
        state: 'enabled',
        conditions: {
          users: { includeUsers: ['All'], excludeUsers: ['svc-exclusion-group'] },
          applications: { includeApplications: ['Office365'] },
        },
        grantControls: { operator: 'AND', builtInControls: ['compliantDevice'] },
      },
      {
        id: 'ca-004-admin-locations',
        displayName: 'Restrict Admin Access to Trusted Locations',
        createdDateTime: daysAgo(90),
        modifiedDateTime: daysAgo(3),
        state: 'enabled',
        conditions: {
          users: { includeRoles: ['62e90394-69f5-4237-9190-012177145e10'] },
          locations: { includeLocations: ['All'], excludeLocations: ['AllTrusted'] },
        },
        grantControls: { operator: 'OR', builtInControls: ['block'] },
      },
      {
        id: 'ca-005-session-controls',
        displayName: 'Sign-in Frequency — Privileged Roles',
        createdDateTime: daysAgo(60),
        modifiedDateTime: daysAgo(1),
        state: 'enabled',
        conditions: {
          users: { includeRoles: ['62e90394-69f5-4237-9190-012177145e10', 'f28a1f50-f6e7-4571-818b-6a12f2af6b6c'] },
          applications: { includeApplications: ['All'] },
        },
        grantControls: { operator: 'OR', builtInControls: ['mfa'] },
        sessionControls: { signInFrequency: { value: 4, type: 'hours' } },
      },
    ],
  },

  'AC.L2-3.1.2': {
    '@odata.context': 'https://management.azure.com/$metadata#roleAssignments',
    value: [
      {
        id: '/subscriptions/sub-contoso-001/providers/Microsoft.Authorization/roleAssignments/ra-001',
        type: 'Microsoft.Authorization/roleAssignments',
        name: 'ra-001',
        properties: {
          roleDefinitionId: '/subscriptions/sub-contoso-001/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c',
          principalId: 'user-jsmith-00001',
          principalType: 'User',
          scope: '/subscriptions/sub-contoso-001',
          createdOn: daysAgo(365),
          updatedOn: daysAgo(365),
        },
      },
      {
        id: '/subscriptions/sub-contoso-001/providers/Microsoft.Authorization/roleAssignments/ra-002',
        type: 'Microsoft.Authorization/roleAssignments',
        name: 'ra-002',
        properties: {
          roleDefinitionId: '/subscriptions/sub-contoso-001/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c',
          principalId: 'sp-devops-pipeline-00002',
          principalType: 'ServicePrincipal',
          scope: '/subscriptions/sub-contoso-001',
          createdOn: daysAgo(200),
          updatedOn: daysAgo(200),
        },
      },
      {
        id: '/subscriptions/sub-contoso-001/providers/Microsoft.Authorization/roleAssignments/ra-003',
        properties: {
          roleDefinitionId: '/subscriptions/sub-contoso-001/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7',
          principalId: 'group-devteam-00003',
          principalType: 'Group',
          scope: '/subscriptions/sub-contoso-001',
          createdOn: daysAgo(180),
        },
      },
      {
        id: '/subscriptions/sub-contoso-001/providers/Microsoft.Authorization/roleAssignments/ra-004',
        properties: {
          roleDefinitionId: '/subscriptions/sub-contoso-001/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7',
          principalId: 'group-secops-00004',
          principalType: 'Group',
          scope: '/subscriptions/sub-contoso-001/resourceGroups/rg-security',
          createdOn: daysAgo(150),
        },
      },
      {
        id: '/subscriptions/sub-contoso-001/providers/Microsoft.Authorization/roleAssignments/ra-005',
        properties: {
          roleDefinitionId: '/subscriptions/sub-contoso-001/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7',
          principalId: 'group-infra-00005',
          principalType: 'Group',
          scope: '/subscriptions/sub-contoso-001/resourceGroups/rg-infra',
          createdOn: daysAgo(120),
        },
      },
      {
        id: '/subscriptions/sub-contoso-001/providers/Microsoft.Authorization/roleAssignments/ra-006',
        properties: {
          roleDefinitionId: '/subscriptions/sub-contoso-001/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7',
          principalId: 'group-readonly-00006',
          principalType: 'Group',
          scope: '/subscriptions/sub-contoso-001',
          createdOn: daysAgo(90),
        },
      },
    ],
  },

  'AU.L2-3.3.1': {
    value: generateActivityLogs(27),
  },

  'IA.L2-3.5.1': {
    '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#users',
    value: generateUsers(47),
  },

  // 41/45 users with MFA = 91.1% → warning (below 95% threshold)
  'IA.L2-3.5.2': {
    '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#reports/authenticationMethods/userRegistrationDetails',
    value: generateMFARegistrations(45, 41),
  },

  // dev-nsg has open RDP (3389) from 0.0.0.0/0 → fail
  'SC.L2-3.13.1': {
    value: [
      {
        id: '/subscriptions/sub-contoso-001/resourceGroups/rg-infra/providers/Microsoft.Network/networkSecurityGroups/prod-vnet-nsg',
        name: 'prod-vnet-nsg',
        type: 'Microsoft.Network/networkSecurityGroups',
        location: 'eastus',
        properties: {
          securityRules: [
            {
              name: 'Allow-HTTPS-Inbound',
              properties: {
                priority: 100,
                direction: 'Inbound',
                access: 'Allow',
                protocol: 'Tcp',
                sourceAddressPrefix: '*',
                destinationAddressPrefix: '*',
                destinationPortRange: '443',
              },
            },
            {
              name: 'Allow-HTTP-Redirect',
              properties: {
                priority: 110,
                direction: 'Inbound',
                access: 'Allow',
                protocol: 'Tcp',
                sourceAddressPrefix: '*',
                destinationAddressPrefix: '*',
                destinationPortRange: '80',
              },
            },
            {
              name: 'Deny-All-Inbound',
              properties: {
                priority: 4096,
                direction: 'Inbound',
                access: 'Deny',
                protocol: '*',
                sourceAddressPrefix: '*',
                destinationAddressPrefix: '*',
                destinationPortRange: '*',
              },
            },
          ],
        },
      },
      {
        id: '/subscriptions/sub-contoso-001/resourceGroups/rg-dev/providers/Microsoft.Network/networkSecurityGroups/dev-nsg',
        name: 'dev-nsg',
        type: 'Microsoft.Network/networkSecurityGroups',
        location: 'eastus',
        properties: {
          securityRules: [
            {
              name: 'Allow-RDP-Any',
              properties: {
                priority: 100,
                direction: 'Inbound',
                access: 'Allow',
                protocol: 'Tcp',
                sourceAddressPrefix: '0.0.0.0/0',
                destinationAddressPrefix: '*',
                destinationPortRange: '3389',
              },
            },
            {
              name: 'Allow-SSH-Internal-Only',
              properties: {
                priority: 110,
                direction: 'Inbound',
                access: 'Allow',
                protocol: 'Tcp',
                sourceAddressPrefix: '10.0.0.0/8',
                destinationAddressPrefix: '*',
                destinationPortRange: '22',
              },
            },
          ],
        },
      },
      {
        id: '/subscriptions/sub-contoso-001/resourceGroups/rg-infra/providers/Microsoft.Network/networkSecurityGroups/app-tier-nsg',
        name: 'app-tier-nsg',
        type: 'Microsoft.Network/networkSecurityGroups',
        location: 'eastus',
        properties: {
          securityRules: [
            {
              name: 'Allow-App-Internal',
              properties: {
                priority: 100,
                direction: 'Inbound',
                access: 'Allow',
                protocol: 'Tcp',
                sourceAddressPrefix: '10.0.1.0/24',
                destinationAddressPrefix: '*',
                destinationPortRange: '8080',
              },
            },
            {
              name: 'Allow-LB-Probe',
              properties: {
                priority: 110,
                direction: 'Inbound',
                access: 'Allow',
                protocol: 'Tcp',
                sourceAddressPrefix: 'AzureLoadBalancer',
                destinationAddressPrefix: '*',
                destinationPortRange: '8080',
              },
            },
          ],
        },
      },
    ],
  },
};

function getMockData(controlId) {
  const data = MOCK_AZURE_DATA[controlId];
  if (!data) throw new Error(`No mock data for control: ${controlId}`);
  return JSON.parse(JSON.stringify(data)); // Return a deep copy each time
}

module.exports = { getMockData, MOCK_AZURE_DATA };
