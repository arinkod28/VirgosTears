// Mock tenant — always reports as connected so the UI skips the connection gate
const MOCK_TENANT = 'Contoso Defense Corp';

let connectionStatus = {
  connected: true,
  tenant: MOCK_TENANT,
  testedAt: new Date().toISOString(),
};

/**
 * Returns mock connection success — no Azure credentials required
 */
async function testConnection(req, res) {
  connectionStatus = {
    connected: true,
    tenant: MOCK_TENANT,
    testedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    tenant: MOCK_TENANT,
    message: `Connected to Azure tenant: ${MOCK_TENANT}`,
  });
}

/**
 * Return current connection status
 */
function getStatus(req, res) {
  res.json(connectionStatus);
}

module.exports = { testConnection, getStatus };
