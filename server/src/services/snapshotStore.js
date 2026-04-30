const db = require('../config/database');

/**
 * Get the latest scan snapshot for each control
 */
function getLatestSnapshots() {
  return db
    .prepare(
      `SELECT s.*
       FROM scan_snapshots s
       INNER JOIN (
         SELECT control_id, MAX(scanned_at) as max_date
         FROM scan_snapshots
         GROUP BY control_id
       ) latest ON s.control_id = latest.control_id AND s.scanned_at = latest.max_date
       ORDER BY s.control_id`
    )
    .all();
}

/**
 * Get scan history for a specific control
 */
function getControlHistory(controlId, limit = 10) {
  return db
    .prepare(
      'SELECT * FROM scan_snapshots WHERE control_id = ? ORDER BY scanned_at DESC LIMIT ?'
    )
    .all(controlId, limit);
}

/**
 * Store a scan result
 */
function storeScanResult({ controlId, rawJson, evidenceHash, status, findings, timestamp }) {
  return db
    .prepare(
      'INSERT INTO scan_snapshots (control_id, raw_json, evidence_hash, status, findings, scanned_at) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(controlId, rawJson, evidenceHash, status, JSON.stringify(findings), timestamp);
}

/**
 * Get dashboard summary stats
 */
function getDashboardStats() {
  const snapshots = getLatestSnapshots();
  const total = snapshots.length;
  const passing = snapshots.filter((s) => s.status === 'pass').length;
  const failing = snapshots.filter((s) => s.status === 'fail').length;
  const warnings = snapshots.filter((s) => s.status === 'warning').length;

  return {
    total,
    passing,
    failing,
    warnings,
    complianceRate: total > 0 ? ((passing / total) * 100).toFixed(1) : 0,
    lastScanDate: snapshots.length > 0 ? snapshots[0].scanned_at : null,
  };
}

module.exports = { getLatestSnapshots, getControlHistory, storeScanResult, getDashboardStats };
