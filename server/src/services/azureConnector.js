const { getGraphToken, getArmToken, SUBSCRIPTION_ID } = require('../config/azure');
const { CONTROLS } = require('../config/controls');

const GRAPH_BASE = 'https://graph.microsoft.com/v1.0';
const ARM_BASE = 'https://management.azure.com';

/**
 * Fetch data from an Azure API endpoint
 */
async function fetchAzure(apiType, endpoint) {
  const token = apiType === 'graph' ? await getGraphToken() : await getArmToken();
  const baseUrl = apiType === 'graph' ? GRAPH_BASE : ARM_BASE;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Azure API error (${response.status}): ${errorBody}`);
  }

  return response.json();
}

/**
 * Fetch data for a specific CMMC control
 */
async function fetchControlData(controlId) {
  const control = CONTROLS[controlId];
  if (!control) throw new Error(`Unknown control: ${controlId}`);

  const endpoint =
    typeof control.endpoint === 'function'
      ? control.endpoint(SUBSCRIPTION_ID)
      : control.endpoint;

  const data = await fetchAzure(control.apiType, endpoint);
  return data;
}

/**
 * Run a full scan — fetch all 6 controls
 */
async function runFullScan() {
  const results = {};

  for (const [controlId, control] of Object.entries(CONTROLS)) {
    try {
      const data = await fetchControlData(controlId);
      results[controlId] = {
        success: true,
        data,
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      results[controlId] = {
        success: false,
        error: error.message,
        fetchedAt: new Date().toISOString(),
      };
    }
  }

  return results;
}

module.exports = { fetchAzure, fetchControlData, runFullScan };
