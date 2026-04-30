const { runFullScan } = require('../services/azureConnector');
const { evaluate } = require('../services/controlEvaluator');
const { createEvidenceRecord } = require('../services/evidenceHasher');
const { storeScanResult, getLatestSnapshots, getControlHistory, getDashboardStats } = require('../services/snapshotStore');

/**
 * Run a full scan of all 6 controls, evaluate, hash, and store
 */
async function runScan(req, res, next) {
  try {
    const rawResults = await runFullScan();
    const processed = [];

    for (const [controlId, result] of Object.entries(rawResults)) {
      if (!result.success) {
        processed.push({
          controlId,
          status: 'error',
          findings: [result.error],
          evidenceHash: null,
          timestamp: result.fetchedAt,
        });
        continue;
      }

      const evaluation = evaluate(controlId, result.data);
      const evidence = createEvidenceRecord(controlId, result.data);

      storeScanResult({
        controlId,
        rawJson: evidence.rawJson,
        evidenceHash: evidence.evidenceHash,
        status: evaluation.status,
        findings: evaluation.findings,
        timestamp: evidence.timestamp,
      });

      processed.push({
        controlId,
        status: evaluation.status,
        findings: evaluation.findings,
        evidenceHash: evidence.evidenceHash,
        timestamp: evidence.timestamp,
      });
    }

    res.json({
      success: true,
      scannedAt: new Date().toISOString(),
      results: processed,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get the latest scan snapshot for each control
 */
function getLatest(req, res) {
  const snapshots = getLatestSnapshots();
  res.json({ snapshots });
}

/**
 * Get dashboard summary stats
 */
function getStats(req, res) {
  const stats = getDashboardStats();
  res.json(stats);
}

/**
 * Get scan history for a specific control
 */
function getHistory(req, res) {
  const { controlId } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  const history = getControlHistory(controlId, limit);
  res.json({ controlId, history });
}

module.exports = { runScan, getLatest, getStats, getHistory };
