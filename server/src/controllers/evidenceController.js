const { fetchControlData } = require('../services/azureConnector');
const { evaluate } = require('../services/controlEvaluator');
const { createEvidenceRecord, verifyHash } = require('../services/evidenceHasher');
const { storeScanResult, getControlHistory } = require('../services/snapshotStore');
const { CONTROL_IDS } = require('../config/controls');

/**
 * Fetch live evidence from Azure for a specific control
 */
async function getEvidence(req, res, next) {
  try {
    const { controlId } = req.params;

    if (!CONTROL_IDS.includes(controlId)) {
      return res.status(400).json({
        error: `Invalid control ID. Must be one of: ${CONTROL_IDS.join(', ')}`,
      });
    }

    const data = await fetchControlData(controlId);
    const evaluation = evaluate(controlId, data);
    const evidence = createEvidenceRecord(controlId, data);

    // Store this fetch as a snapshot
    storeScanResult({
      controlId,
      rawJson: evidence.rawJson,
      evidenceHash: evidence.evidenceHash,
      status: evaluation.status,
      findings: evaluation.findings,
      timestamp: evidence.timestamp,
    });

    res.json({
      controlId,
      status: evaluation.status,
      findings: evaluation.findings,
      evidenceHash: evidence.evidenceHash,
      timestamp: evidence.timestamp,
      recordCount: (data.value || []).length,
      rawData: data, // Include raw for the AI bot or detailed view
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Verify a previously stored evidence hash
 */
function verifyEvidence(req, res) {
  const { controlId, hash } = req.params;

  const history = getControlHistory(controlId, 50);
  const match = history.find((s) => s.evidence_hash === hash);

  if (!match) {
    return res.json({ verified: false, message: 'Hash not found in scan history.' });
  }

  const isValid = verifyHash(JSON.parse(match.raw_json), match.scanned_at, hash);

  res.json({
    verified: isValid,
    controlId,
    hash,
    scannedAt: match.scanned_at,
    status: match.status,
  });
}

module.exports = { getEvidence, verifyEvidence };
