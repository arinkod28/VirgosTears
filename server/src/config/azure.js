const msal = require('@azure/msal-node');

// MSAL confidential client for server-to-server auth
const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
};

const msalClient = new msal.ConfidentialClientApplication(msalConfig);

// Scopes for different Azure APIs
const GRAPH_SCOPES = ['https://graph.microsoft.com/.default'];
const ARM_SCOPES = ['https://management.azure.com/.default'];

/**
 * Get an access token for Microsoft Graph API
 */
async function getGraphToken() {
  const result = await msalClient.acquireTokenByClientCredential({
    scopes: GRAPH_SCOPES,
  });
  return result.accessToken;
}

/**
 * Get an access token for Azure Resource Manager API
 */
async function getArmToken() {
  const result = await msalClient.acquireTokenByClientCredential({
    scopes: ARM_SCOPES,
  });
  return result.accessToken;
}

module.exports = {
  msalClient,
  getGraphToken,
  getArmToken,
  SUBSCRIPTION_ID: process.env.AZURE_SUBSCRIPTION_ID,
};
