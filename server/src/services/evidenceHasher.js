const crypto = require('crypto');

/**
 * Generate a SHA-256 hash of the evidence payload + timestamp.
 * This proves the evidence wasn't tampered with after collection.
 */
function hashEvidence(rawJson, timestamp) {
  const payload = JSON.stringify(rawJson) + '|' + timestamp;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Verify a hash matches the original payload
 */
function verifyHash(rawJson, timestamp, expectedHash) {
  const computed = hashEvidence(rawJson, timestamp);
  return computed === expectedHash;
}

/**
 * Create a complete evidence record with hash
 */
function createEvidenceRecord(controlId, rawData) {
  const timestamp = new Date().toISOString();
  const hash = hashEvidence(rawData, timestamp);

  return {
    controlId,
    rawJson: JSON.stringify(rawData),
    evidenceHash: hash,
    timestamp,
  };
}

module.exports = { hashEvidence, verifyHash, createEvidenceRecord };
