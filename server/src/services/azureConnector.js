const { getMockData } = require('../data/mockAzureData');
const { CONTROLS, CONTROL_IDS } = require('../config/controls');

/**
 * Fetch data for a specific CMMC control from the mock data layer.
 * The mock data mirrors the exact structure Azure Graph/ARM APIs return,
 * so all downstream evaluators, hashers, and snapshot stores work unchanged.
 */
async function fetchControlData(controlId) {
  if (!CONTROLS[controlId]) throw new Error(`Unknown control: ${controlId}`);
  return getMockData(controlId);
}

/**
 * Run a full scan — fetch all 6 controls
 */
async function runFullScan() {
  const results = {};

  for (const controlId of CONTROL_IDS) {
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

module.exports = { fetchControlData, runFullScan };
