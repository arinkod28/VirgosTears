/**
 * Global error handler — catches all unhandled errors from routes
 */
function errorHandler(err, req, res, _next) {
  console.error(`[Error] ${req.method} ${req.path}:`, err.message);

  // Azure auth errors
  if (err.message?.includes('AADSTS')) {
    return res.status(401).json({
      error: 'Azure authentication failed',
      detail: err.message,
      hint: 'Check your AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, and AZURE_TENANT_ID in .env',
    });
  }

  // Azure API errors
  if (err.message?.includes('Azure API error')) {
    return res.status(502).json({
      error: 'Azure API request failed',
      detail: err.message,
    });
  }

  // Anthropic API errors
  if (err.message?.includes('anthropic') || err.status === 429) {
    return res.status(502).json({
      error: 'AI service error',
      detail: err.message,
    });
  }

  // Default
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
}

module.exports = { errorHandler };
