const Groq = require('groq-sdk');
const { fetchControlData } = require('./azureConnector');
const { createEvidenceRecord } = require('./evidenceHasher');
const { CONTROLS, CONTROL_IDS } = require('../config/controls');
const db = require('../config/database');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an AI compliance assistant for a CMMC 2.0 dashboard that monitors Microsoft Azure.

You help users understand their compliance status and retrieve evidence for audits.

You have access to these 6 CMMC Level 2 controls:
${CONTROL_IDS.map((id) => `- ${id}: ${CONTROLS[id].title} (Source: ${CONTROLS[id].azureSource})`).join('\n')}

When a user asks for evidence for a control:
1. Identify which control they're asking about
2. Use the get_evidence function with the control ID
3. Explain the results in plain language
4. Include the evidence hash for audit purposes

Keep responses concise and professional. If asked about controls outside these 6, explain that this dashboard only monitors the listed controls.`;

/**
 * Process a chat message using Groq (Llama)
 */
async function processChat(sessionId, userMessage) {
  // Save user message
  db.prepare(
    'INSERT INTO chat_history (session_id, role, content) VALUES (?, ?, ?)'
  ).run(sessionId, 'user', userMessage);

  const tools = [
    {
      name: 'get_evidence',
      description:
        'Fetch live evidence from Azure for a specific CMMC control. Returns raw API data, evaluation results, and a SHA-256 evidence hash.',
      parameters: {
        type: 'object',
        properties: {
          control_id: {
            type: 'string',
            description: `The CMMC control ID. Must be one of: ${CONTROL_IDS.join(', ')}`,
            enum: CONTROL_IDS,
          },
        },
        required: ['control_id'],
      },
    },
  ];

  // Initial Groq call
  let response = await groq.chat.completions.create({
    model: 'llama-3.1-70b-versatile',
    max_tokens: 1024,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage }
    ],
    tools,
    tool_choice: 'auto',
  });

  let assistantMessage = '';
  let toolCalls = response.choices[0]?.message?.tool_calls || [];

  // Handle tool use loop
  while (toolCalls.length > 0) {
    const toolCall = toolCalls[0];
    let toolResult;

    try {
      const controlId = toolCall.function.arguments ? JSON.parse(toolCall.function.arguments).control_id : null;
      
      if (!controlId) {
        throw new Error('No control_id provided');
      }

      const data = await fetchControlData(controlId);
      const evidence = createEvidenceRecord(controlId, data);

      // Store snapshot
      const { evaluate } = require('./controlEvaluator');
      const evaluation = evaluate(controlId, data);

      db.prepare(
        'INSERT INTO scan_snapshots (control_id, raw_json, evidence_hash, status, findings, scanned_at) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(
        evidence.controlId,
        evidence.rawJson,
        evidence.evidenceHash,
        evaluation.status,
        JSON.stringify(evaluation.findings),
        evidence.timestamp
      );

      toolResult = JSON.stringify({
        control_id: controlId,
        status: evaluation.status,
        findings: evaluation.findings,
        evidence_hash: evidence.evidenceHash,
        timestamp: evidence.timestamp,
        record_count: (data.value || []).length,
      });
    } catch (error) {
      toolResult = JSON.stringify({ error: error.message });
    }

    // Continue conversation with tool result
    response = await groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
        { role: 'assistant', content: null, tool_calls: toolCalls },
        {
          role: 'tool',
          tool_call_id: toolCalls[0].id,
          content: toolResult,
        },
      ],
      tools,
      tool_choice: 'auto',
    });

    toolCalls = response.choices[0]?.message?.tool_calls || [];
  }

  // Extract final text response
  assistantMessage = response.choices[0]?.message?.content || '';

  // Save assistant message
  db.prepare(
    'INSERT INTO chat_history (session_id, role, content) VALUES (?, ?, ?)'
  ).run(sessionId, 'assistant', assistantMessage);

  return assistantMessage;
}

module.exports = { processChat };
