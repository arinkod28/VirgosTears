require('dotenv').config();
const app = require('./app');
const { runFullScan } = require('./services/azureConnector');
const { evaluate } = require('./services/controlEvaluator');
const { createEvidenceRecord } = require('./services/evidenceHasher');
const { storeScanResult, getLatestSnapshots } = require('./services/snapshotStore');

const PORT = process.env.PORT || 4000;

async function seedIfEmpty() {
  const existing = getLatestSnapshots();
  if (existing.length > 0) return;

  console.log('[CMMC] No scan data found — seeding initial scan...');
  const rawResults = await runFullScan();

  for (const [controlId, result] of Object.entries(rawResults)) {
    if (!result.success) {
      console.warn(`[CMMC] Seed skipped for ${controlId}: ${result.error}`);
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
    console.log(`[CMMC] Seeded ${controlId} → ${evaluation.status}`);
  }

  console.log('[CMMC] Initial scan data ready.');
}

app.listen(PORT, async () => {
  console.log(`[CMMC Server] Running on http://localhost:${PORT}`);
  console.log(`[CMMC Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  await seedIfEmpty();
});
