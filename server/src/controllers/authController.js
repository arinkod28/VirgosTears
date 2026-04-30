const { getGraphToken } = require('../config/azure');

let connectionStatus = { connected: false, tenant: null, testedAt: null };

/**
 * Test Azure connection by attempting to acquire a Graph token
 */
async function testConnection(req, res, next) {
  try {
    const token = await getGraphToken();

    // Quick validation — fetch tenant info
    const response = await fetch('https://graph.microsoft.com/v1.0/organization', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Azure returned ${response.status}`);
    }

    const orgData = await response.json();
    const tenant = orgData.value?.[0]?.displayName || 'Unknown';

    connectionStatus = {
      connected: true,
      tenant,
      testedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      tenant,
      message: `Connected to Azure tenant: ${tenant}`,
    });
  } catch (error) {
    connectionStatus = { connected: false, tenant: null, testedAt: new Date().toISOString() };
    next(error);
  }
}

/**
 * Return current connection status
 */
function getStatus(req, res) {
  res.json(connectionStatus);
}

module.exports = { testConnection, getStatus };
